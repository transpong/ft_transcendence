import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PongService } from './pong.service';
import { GameService } from '../../game/service/game.service';
import { MatchStatus } from '../../game/enum/MatchStatus';

@WebSocketGateway({ cors: true })
export class GatewayService {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: any;

  private usersWaiting: Array<string> = [];

  private pongGames: Map<string, PongService> = new Map();

  private playerRooms: Map<string, string> = new Map();

  async handleConnection(client: Socket) {
    console.log('User: ' + client.id + ' connected');
  }

  async handleDisconnect(client: Socket) {
    console.log('User: ' + client.id + ' disconnected');

    if (this.usersWaiting.includes(client.id)) {
      this.usersWaiting = this.usersWaiting.filter(
        (user) => user !== client.id,
      );
      return;
    }
  }

  // ###########################################################################
  // ############################## PONG #######################################
  // ###########################################################################

  @SubscribeMessage('joinRoom')
  async handleRoom(client: Socket) {
    if (this.usersWaiting.includes(client.id)) {
      return;
    }

    this.usersWaiting.push(client.id);
    if (this.usersWaiting.length > 1) {
      await this.makeRoom(client);
      return;
    }
    console.log('user waiting: ' + client.id);
  }

  private async makeRoom(client) {
    console.log('creating room...');

    if (await this.gameService.isMatchHistoryExist(client.id)) {
      console.log('match history exist');
      return;
    }

    const user1 = client.id;
    const user2 = this.usersWaiting.find((user) => user !== user1);

    const roomName = this.createRoomName(user1, user2);

    // add this user to the room
    this.server.socketsJoin(roomName, client.id);

    // add the other user to the room
    this.server.socketsJoin(roomName, user2);

    // send the room name to the users inside the room
    this.server.to(roomName).emit('room', roomName);

    // print double rooms
    console.log(this.findDoubleRooms());

    // send messages only to the users inside the room
    this.sendMessagesToRoom(roomName, 'Partida Encontrada');

    // delete users from the users waiting list
    this.usersWaiting = this.usersWaiting.filter(
      (user) => user !== user1 && user !== user2,
    );

    console.log('users waiting: ' + this.usersWaiting);

    // add users to the map
    this.playerRooms.set(user1, roomName);
    this.playerRooms.set(user2, roomName);

    // throw new Error('Method not implemented.');

    // add users to MatchHistoryEntity
    await this.gameService.createMatchHistory(user1, user2, roomName);

    // create a pong game for the room
    this.pongGames.set(
      roomName,
      new PongService(this.gameService, user1, user2),
    );
    this.server
      .to(roomName)
      .emit('toGame', this.pongGames.get(roomName).getGameState()); // TODO: remove
  }

  findDoubleRooms() {
    const availableRooms = [];
    const rooms = this.server.sockets.adapter.rooms;

    if (rooms) {
      for (const [key] of rooms) {
        if (key.length > 13) {
          availableRooms.push(key);
        }
      }
    }

    return availableRooms;
  }

  private getUsersFromRoom(roomName: string) {
    // get the users from the room
    const roomUsers = this.server.sockets.adapter.rooms.get(roomName);
    const iterator = roomUsers.values();
    const firstUser = iterator.next().value;
    const secondUser = iterator.next().value;

    console.log('Primeiro usuário:', firstUser);
    console.log('Segundo usuário:', secondUser);
  }

  private createRoomName(user1: string, user2: string): string {
    return `${user1}-${user2}-${Date.now()}`;
  }

  @SubscribeMessage('startGame')
  async handleStartGame(client: Socket, message: string) {
    console.log('calling startGame from ' + message, client.id);

    if (await this.gameService.isMatchHistoryExist(client.id)) {
      const roomName = await this.gameService.getRoomId(client.id);
      const match = await this.gameService.getByRoomName(roomName);

      match.readyPlayer(client.id);
      await this.gameService.updateMatch(match);
      // throw new Error('Method not implemented.');
      console.log('match status: ' + match.user1IsReady + match.user2IsReady);
      if (match.isReady() && match.status === MatchStatus.IS_WAITING) {
        console.log('start game' + client.id);

        console.log(
          'roomName from: ' + client.id + ' is ' + roomName + message,
        );
        const pongService = this.pongGames.get(roomName);
        const gameState = pongService.getGameState();
        if (client.id === 'anhigo-s') {
          console.log(gameState);
        }
        this.server.to(roomName).emit('pong', gameState);

        pongService.startGameLoop(roomName, this.server);
        return;
      }
      console.log('not ready ' + client.id);
      this.server.to(roomName).emit('ready', false);
    }
    setTimeout(() => {
      console.log('timeout');
      this.handleStartGame(client, message);
    }, 1000);
  }

  @SubscribeMessage('endGame')
  async handleEndGame(client: Socket) {
    const roomName = this.playerRooms.get(client.id);
    // delete the room from the map
    this.playerRooms.delete(roomName);

    // delete the pong game from the map
    this.pongGames.delete(roomName);

    // delete the room
    this.server.socketsLeave(roomName);
  }

  @SubscribeMessage('moveUp')
  async handleMoveUp(client: Socket) {
    const roomName = this.playerRooms.get(client.id);
    const pongService = this.pongGames.get(roomName);

    if (pongService) {
      pongService.moveUp(client.id);

      const gameState = pongService.getGameState();
      this.server.to(roomName).emit('pong', gameState);
    }
  }

  @SubscribeMessage('moveDown')
  async handleMoveDown(client: Socket) {
    const roomName = this.playerRooms.get(client.id);
    const pongService = this.pongGames.get(roomName);

    if (pongService) {
      pongService.moveDown(client.id);

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
    return this.pongGames.get(roomName);
  }

  private createPlayerArray(myId: string, roomName: string): string[] {
    const roomUsers = this.server.sockets.adapter.rooms.get(roomName);
    const iterator = roomUsers.values();
    const user1 = iterator.next().value;
    const user2 = iterator.next().value;

    if (user1 === myId) {
      return [user1, user2];
    } else if (user2 === myId) {
      return [user2, user1];
    }

    return undefined;
  }

  private sendMessagesToRoom(room: string, message: string) {
    let counter = 0;
    const interval = setInterval(() => {
      this.server.to(room).emit('message', message);
      counter++;
      if (counter === 1) {
        clearInterval(interval);
      }
    }, 1000);
  }
}
