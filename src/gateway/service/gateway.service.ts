import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from '../../user/service/user.service';
import { PongService } from './pong.service';

@WebSocketGateway()
export class GatewayService {
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: any;

  private users: Array<string> = [];

  private pong: Map<string, PongService> = new Map();

  private mapRooms: Map<string, string> = new Map();

  async handleConnection(client: Socket) {}

  async handleDisconnect() {
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('joinRoom')
  async handleRoom(client: Socket) {
    this.users.push(client.id);

    if (this.users.length === 2) {
      // create a new room if it doesn't exist
      const user1 = this.users[0];
      const user2 = this.users[1];

      const roomName = `${user1}-${user2}`;

      // add users to the room
      this.server.socketsJoin(roomName);

      // send the room name to the client
      this.server.to(roomName).emit('room', roomName);

      // send messages to the room
      this.sendMessagesToRoom(roomName, 'Partida Encontrada');

      // filter users from the list
      this.users = this.users.filter(
        (user) => user !== user1 && user !== user2,
      );
      console.log('users', this.users);

      // add users to the map
      this.mapRooms.set(user1, roomName);
      this.mapRooms.set(user2, roomName);

      // get the users from the room
      const roomUsers = this.server.sockets.adapter.rooms.get(roomName);
      const iterator = roomUsers.values();
      const firstUser = iterator.next().value;
      const secondUser = iterator.next().value;

      console.log('Primeiro usuário:', firstUser);
      console.log('Segundo usuário:', secondUser);

      this.sendRegressiveCountToRoom(roomName, 10);

      // create a pong game for the room
      this.pong.set(roomName, new PongService());
    }
  }

  @SubscribeMessage('moveUp')
  async handleMoveUp(client: Socket) {
    const roomName = this.mapRooms.get(client.id);
    const myPong = this.pong.get(roomName);
    console.log(myPong);
    myPong.moveUp();
    this.server.to(roomName).emit('pong', myPong.getCoordinates());
  }

  private sendMessagesToRoom(room: string, message: string) {
    let counter = 0;
    const interval = setInterval(() => {
      this.server.to(room).emit('message', message);
      counter++;
      if (counter === 3) {
        clearInterval(interval);
      }
    }, 1000);
  }

  private sendRegressiveCountToRoom(room: string, count: number) {
    let counter = count;
    const interval = setInterval(() => {
      this.server.to(room).emit('timer', counter);
      counter--;
      if (counter === 0) {
        clearInterval(interval);
      }
    }, 1000);
    if (counter === 0) {
      this.server.to(room).emit('timer', 'Game Over');
    }
  }
}
