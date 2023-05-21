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

  private pongService: PongService = new PongService();

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

      // create a pong game for the room
      this.pong.set(roomName, this.pongService);
    }
  }

  @SubscribeMessage('startGame')
  handleStartGame(client: Socket) {
    // Start the game and emit the initial game state to players
    const roomName = this.mapRooms.get(client.id);
    const gameState = this.pongService.getGameState();
    this.server.to(roomName).emit('pong', gameState);

    // Start the game loop
    this.pongService.startGameLoop(roomName, this.server);
  }

  @SubscribeMessage('moveUp')
  async handleMoveUp(client: Socket) {
    const roomName = this.mapRooms.get(client.id);
    const pongService = this.pong.get(roomName);

    if (pongService) {
      const playerId = this.getPlayerIdInRoom(roomName, client.id);
      if (playerId === 1) {
        pongService.movePlayer1Up();
      } else if (playerId === 2) {
        pongService.movePlayer2Up();
      }

      const gameState = pongService.getGameState();
      this.server.to(roomName).emit('pong', gameState);
    }
  }

  @SubscribeMessage('moveDown')
  async handleMoveDown(client: Socket) {
    const roomName = this.mapRooms.get(client.id);
    const pongService = this.pong.get(roomName);

    if (pongService) {
      const playerId = this.getPlayerIdInRoom(roomName, client.id);
      if (playerId === 1) {
        pongService.movePlayer1Down();
      } else if (playerId === 2) {
        pongService.movePlayer2Down();
      }

      const gameState = pongService.getGameState();
      this.server.to(roomName).emit('pong', gameState);
    }
  }

  private getPlayerIdInRoom(roomName: string, playerId: string): number | undefined {
    const roomUsers = this.server.sockets.adapter.rooms.get(roomName);
    const iterator = roomUsers.values();
    const user1 = iterator.next().value;
    const user2 = iterator.next().value;

    if (user1 === playerId) {
      return 1;
    } else if (user2 === playerId) {
      return 2;
    }

    return undefined;
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
