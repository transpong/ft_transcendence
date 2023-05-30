import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PongService } from './pong.service';
import { GameService } from '../../game/service/game.service';

@WebSocketGateway({ cors: true })
export class GatewayService {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: any;

  private usersWaiting: Array<string> = [];

  // <roomName, pongService>
  private pong: Map<string, PongService> = new Map();

  private mapRooms: Map<string, string> = new Map();

  async handleConnection(client: Socket) {
    console.log('Client:\t' + client.id + ' connected'); // TODO: remove
  }

  async handleDisconnect() {
    this.server.emit('users', this.usersWaiting);
  }

  @SubscribeMessage('joinRoom')
  async handleRoom(client: Socket) {
    if (this.usersWaiting[0] !== client.id) this.usersWaiting.push(client.id);
    console.log('there is' + this.usersWaiting.length + 'users');

    if (
      this.usersWaiting.length === 2 &&
      (client.id === this.usersWaiting[0] || client.id === this.usersWaiting[1])
    ) {
      await this.makeRoom(client);
    }
  }

  private async makeRoom(client) {
    const user1 = client.id;
    let user2;

    if (client.id === this.usersWaiting[0]) {
      user2 = this.usersWaiting[1];
    } else {
      user2 = this.usersWaiting[0];
    }

    const roomName = this.createRoomName(user1, user2);

    // add this user to the room
    this.server.socketsJoin(roomName, client.id);

    // add the other user to the room
    this.server.socketsJoin(roomName, user2);

    // send the room name to the users inside the room
    this.server.to(roomName).emit('room', roomName);

    // send messages to the room only to the users inside the room
    this.sendMessagesToRoom(roomName, 'Partida Encontrada');

    // delete users from the users waiting list
    this.usersWaiting = this.usersWaiting.filter(
      (user) => user !== user1 && user !== user2,
    );

    // add users to the map
    this.mapRooms.set(user1, roomName);
    this.mapRooms.set(user2, roomName);

    console.log('joined room: ' + roomName);
    // throw new Error('Method not implemented.');

    // add users to MatchHistoryEntity
    await this.gameService.createMatchHistory(user1, user2, roomName);

    // create a pong game for the room
    this.pong.set(roomName, new PongService());
    this.server
      .to(roomName)
      .emit('startGame', 'Game Found! Waiting for players...');
  }

  private createRoomName(user1: string, user2: string): string {
    return `${user1}-${user2}-${Date.now()}`;
  }

  private printUsersInRoom(roomName: string) {
    // get the users from the room
    const roomUsers = this.server.sockets.adapter.rooms.get(roomName);
    const iterator = roomUsers.values();
    const firstUser = iterator.next().value;
    const secondUser = iterator.next().value;

    console.log('Primeiro usuário:', firstUser);
    console.log('Segundo usuário:', secondUser);
  }

  @SubscribeMessage('startGame')
  handleStartGame(client: Socket) {
    // Start the game and emit the initial game state to players
    const roomName = this.mapRooms.get(client.id);
    console.log('roomName get', roomName);

    throw new Error('Method not implemented.');
    const pongService = this.pong.get(roomName);
    const gameState = pongService.getGameState();
    this.server.to(roomName).emit('pong', gameState);

    // Start the game loop
    pongService.startGameLoop(roomName, this.server);
  }

  @SubscribeMessage('endGame')
  async handleEndGame(client: Socket) {
    const roomName = this.mapRooms.get(client.id);
    // delete the room from the map
    this.mapRooms.delete(roomName);

    // delete the pong game from the map
    this.pong.delete(roomName);

    // delete the room
    this.server.socketsLeave(roomName);
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

  private getPlayerIdInRoom(
    roomName: string,
    playerId: string,
  ): number | undefined {
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

  private pongRoom(roomName: string): PongService | undefined {
    return this.pong.get(roomName);
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
