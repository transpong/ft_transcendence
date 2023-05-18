import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from '../../user/service/user.service';
import { RoomService } from './room.service';

@WebSocketGateway()
export class GatewayService {
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  @WebSocketServer()
  server: any;

  private users: Array<string> = [];

  async handleConnection(client: Socket) {}

  async handleDisconnect() {
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('joinRoom')
  async handleRoom(client: Socket) {
    this.users.push(client.id);

    if (this.users.length === 2) {
      console.log('users', this.users);
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
    }
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
}
