import { Socket } from 'socket.io';
import { GameService } from '../../game/service/game.service';
import { PongService } from './pong.service';
import { MatchStatus } from '../../game/enum/MatchStatus';
import { Server } from 'socket.io';

export class RoomService {
  waitingUsers: Array<Socket> = [];
  pongGames: Map<string, PongService> = new Map();
  roomFromPlayer: Map<string, string> = new Map();

  constructor(private readonly gameService: GameService) {}

  async joinWaitingRoom(client: Socket, server: Server) {
    if (this.waitingUsers.includes(client)) {
      return;
    }

    if (await this.gameService.isMatchHistoryExist(client.id)) {
      console.log('match already exists');
      server.to(client.id).emit('message', 'match already exists');

      // get room name
      const roomName = await this.gameService.getRoomId(client.id);

      // get match
      const match = await this.gameService.getByRoomName(roomName);

      // delete match
      await this.gameService.deleteMatchHistory(roomName);

      // remove clients from room
      server.in(roomName).socketsLeave(roomName);

      // delete pong game
      this.pongGames.delete(roomName);

      // delete room from player
      this.roomFromPlayer.delete(match.user1.ftId);
      this.roomFromPlayer.delete(match.user2.ftId);
    }

    console.log('pushing user ' + client.id + ' to waiting room');
    this.waitingUsers.push(client);
    if (this.waitingUsers.length > 1) {
      try {
        await this.createRoom(client, server);
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }

  async createRoom(client: Socket, server: Server) {
    const namePlayer1 = client.id;
    const socketPlayer2 = this.waitingUsers.find(
      (user) => user.id !== namePlayer1,
    );
    const namePlayer2 = socketPlayer2.id;

    const roomName: string = this.createRoomName(namePlayer1, namePlayer2);

    // remove users from waiting room
    console.log('remove users from waiting room');
    this.waitingUsers = this.waitingUsers.filter(
      (user) => user.id !== namePlayer1 && user.id !== namePlayer2,
    );

    client.join(roomName);
    socketPlayer2.join(roomName);

    // add users to roomFromPlayer
    this.roomFromPlayer.set(namePlayer1, roomName);
    this.roomFromPlayer.set(namePlayer2, roomName);

    // add users to MatchHistoryEntity
    await this.gameService.createMatchHistory(
      namePlayer1,
      namePlayer2,
      roomName,
    );

    // create pong game
    const pongGame = new PongService(
      this.gameService,
      namePlayer1,
      namePlayer2,
    );

    // asign pong game to room
    this.pongGames.set(roomName, pongGame);

    // get pong game state
    const pongGameState = pongGame.getGameState();

    // emit game state to all users in room
    server.to(roomName).emit('toGame', pongGameState);

    // debug
    server.to(client.id).emit('message', 'partida encontrada');
  }

  async startGame(client: Socket, server: Server) {
    if (await this.gameService.isMatchHistoryExist(client.id)) {
      const roomName = await this.gameService.getRoomId(client.id);
      const match = await this.gameService.getByRoomName(roomName);

      // ready player client
      match.readyPlayer(client.id);
      server.to(roomName).emit('message', `player ${client.id} ready`);

      // update match
      await this.gameService.updateMatch(match);

      if (match.isReady() && match.status === MatchStatus.IS_WAITING) {
        // start game
        const pongGame = this.pongGames.get(roomName);
        pongGame.startGameLoop(roomName, server);

        // update match
        match.status = MatchStatus.IS_PLAYING;
        await this.gameService.updateMatch(match);

        // emit game state to all users in room
        server.to(roomName).emit('message', 'game started');

        return;
      }
    }
  }

  async moveUp(client: Socket) {
    const roomName = this.roomNameFromClient(client);
    const pongGame = this.pongGames.get(roomName);

    pongGame.moveUp(client.id);
  }

  async moveDown(client: Socket) {
    const roomName = this.roomNameFromClient(client);
    const pongGame = this.pongGames.get(roomName);

    pongGame.moveDown(client.id);
  }

  async endGame(client: Socket, server: Server) {
    // if user is in waiting room delete him
    console.log('remove user ' + client.id + ' from waiting room');
    if (this.waitingUsers.includes(client)) {
      this.waitingUsers = this.waitingUsers.filter(
        (user) => user.id !== client.id,
      );
    }

    if (!(await this.gameService.isMatchHistoryExist(client.id))) {
      this.removeClientFromAllSocketRooms(client);
      return;
    }
    // exist room and match
    if (!this.roomFromPlayer.has(client.id)) {
      return;
    }

    const roomName = this.roomNameFromClient(client);
    const pongGame = this.pongGames.get(roomName);

    if (pongGame) {
      try {
        await pongGame.stopGameLoop(client.id);
      } catch (WsException) {
        console.log(WsException);
      }
    }

    // remove clients from room
    server.in(roomName).socketsLeave(roomName);

    // remove pong game
    this.pongGames.delete(roomName);

    // remove room from roomFromPlayer
    this.roomFromPlayer.delete(client.id);

    // remove match from database
    this.roomFromPlayer.delete(pongGame.getOpponentName(client.id));
  }

  async enterSpectator(client: Socket, roomName: string) {
    if (!(await this.gameService.getByRoomName(roomName))) {
      return;
    }

    client.join(roomName);
  }

  async debug() {
    // print waiting users
    console.log(
      'waiting users: ',
      this.waitingUsers.map((user) => user.id),
    );
    console.error('pong games: ', this.pongGames);
    console.error('room from player: ', this.roomFromPlayer);
  }

  private deleteSocketFromWaitingUsers(client: Socket) {
    this.waitingUsers = this.waitingUsers.filter(
      (user) => user.id !== client.id,
    );
  }

  private roomNameFromClient(client: Socket): string {
    return this.roomFromPlayer.get(client.id);
  }

  private createRoomName(user1: string, user2: string): string {
    return `${user1}-${user2}-${Date.now()}`;
  }

  private removeClientFromAllSocketRooms(client: Socket): void {
    for (const room of client.rooms) {
      if (room !== 'client.id') client.leave(room);
    }
  }
}
