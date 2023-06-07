import { Server, Socket } from 'socket.io';
import { GameService } from '../../game/service/game.service';
import { PongService } from './pong.service';
import { MatchStatus } from '../../game/enum/MatchStatus';
import { InviteInterface } from '../interface/invite.interface';
import { ToastInterface } from '../interface/toast.interface';
import { MatchHistoryEntity } from '../../game/entity/game.entity';
import { PlayersInterface } from '../interface/players.interface';
import { UserService } from 'src/user/service/user.service';
import { UserEnum } from 'src/user/enum/user.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  waitingUsers: Array<Socket> = [];
  pongGames: Map<string, PongService> = new Map();
  roomFromPlayer: Map<string, string> = new Map();
  inviteUsers: Array<InviteInterface> = [];

  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
  ) {}

  async joinWaitingRoom(client: Socket, server: Server): Promise<void> {
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

  async createRoom(client: Socket, server: Server): Promise<void> {
    const namePlayer1: string = client.id;
    const socketPlayer2 = this.waitingUsers.find(
      (user) => user.id !== namePlayer1,
    );
    const namePlayer2: string = socketPlayer2.id;

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

    // create players interface
    const players: PlayersInterface = {
      player1ftId: namePlayer1,
      player2ftId: namePlayer2,
      player1Nickname: this.getNicknameFromClient(client),
      player2Nickname: this.getNicknameFromClient(socketPlayer2),
    };

    // create pong game
    const pongGame: PongService = new PongService(this.gameService, players);

    // asign pong game to room
    this.pongGames.set(roomName, pongGame);

    // get pong game state
    const pongGameState = pongGame.getGameState();

    // emit game state to all users in room
    server.to(roomName).emit('toGame', pongGameState);

    // debug
    server.to(client.id).emit('message', 'partida encontrada');
  }

  async startGame(client: Socket, server: Server): Promise<void> {
    if (await this.gameService.isMatchHistoryExist(client.id)) {
      const roomName: string = await this.gameService.getRoomId(client.id);
      const match: MatchHistoryEntity = await this.gameService.getByRoomName(
        roomName,
      );

      // ready player client
      match.readyPlayer(client.id);
      await this.userService.updateStatus(client.id, UserEnum.ONGAME);
      server
        .to(roomName)
        .emit('message', `player ${client.handshake.query.nickname} ready`);

      // update match
      await this.gameService.updateMatch(match);

      if (match.isReady() && match.status === MatchStatus.IS_WAITING) {
        // start game
        const pongGame: PongService = this.pongGames.get(roomName);
        if (!pongGame) return;
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

  async moveUp(client: Socket): Promise<void> {
    const roomName: string = this.roomNameFromClient(client);
    const pongGame: PongService = this.pongGames.get(roomName);

    pongGame.moveUp(client.id);
  }

  async moveDown(client: Socket): Promise<void> {
    const roomName: string = this.roomNameFromClient(client);
    const pongGame: PongService = this.pongGames.get(roomName);

    pongGame.moveDown(client.id);
  }

  async endGame(client: Socket, server: Server): Promise<void> {
    // if user is in waiting room delete him
    if (this.waitingUsers.includes(client)) {
      this.waitingUsers = this.waitingUsers.filter(
        (user) => user.id !== client.id,
      );
    }

    await this.userService.updateStatus(client.id, UserEnum.ONLINE);

    const matchHistory = await this.gameService.existingMatchHistory(client.id);

    if (!matchHistory) {
      this.removeClientFromAllSocketRooms(client);
      return;
    }

    if (matchHistory.status === MatchStatus.IS_WAITING)
      this.gameService.deleteMatchHistory(matchHistory.roomId);

    // exist room and match
    if (!this.roomFromPlayer.has(client.id)) {
      return;
    }

    const roomName: string = this.roomNameFromClient(client);
    const pongGame: PongService = this.pongGames.get(roomName);

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

  debug(): void {
    // print waiting users
    console.log(
      'waiting users: ',
      this.waitingUsers.map((user) => user.id),
    );
    console.error('pong games: ', this.pongGames);
    console.error('room from player: ', this.roomFromPlayer);
  }

  async inviteUser(client: Socket, server: Server, userNickname: string) {
    // check if userNickname is empty
    if (!userNickname) {
      this.emitErrorToast(client, server, 'Usuário não pode ser vazio');
      return;
    }

    // check if user is inviting himself
    if (userNickname === client.handshake.query.nickname) {
      this.emitErrorToast(client, server, 'Você não pode se convidar');
      return;
    }

    // check if user is in match
    if (await this.gameService.isMatchHistoryExist(client.id)) {
      this.emitErrorToast(client, server, 'Você já está em uma partida');
      return;
    }

    // check if userNickname is in match
    if (await this.gameService.isMatchHistoryExistByNickname(userNickname)) {
      this.emitErrorToast(client, server, 'Usuário já está em uma partida');
      return;
    }

    // check if socket with userNickname has id exists in server
    if (!this.socketIsConnected(server, userNickname)) {
      this.emitErrorToast(client, server, 'Usuário está offline');
      return;
    }

    // create a Invite interface
    const invite: InviteInterface = {
      from: this.getNicknameFromClient(client),
      to: userNickname,
    };

    // emit invite to userNickname
    if (this.inviteDuplicated(client, userNickname)) {
      this.emitDuplicateInviteToast(server, client, userNickname);
      return;
    }
    this.inviteUsers.push(invite);
    this.emitInviteToast(server, client, userNickname, invite);
  }

  async acceptInvite(
    client: Socket,
    server: Server,
    userNickname: string,
  ): Promise<void> {
    // exist invite
    if (!this.existInvite(client, userNickname)) {
      this.emitErrorToast(client, server, 'Não existe convite');
      return;
    }

    // get invite
    const invite: InviteInterface = this.inviteUsers.find(
      (invite) =>
        invite.to === this.getNicknameFromClient(client) &&
        invite.from === userNickname,
    );

    // emit invite accepted to user that sent invite
    const userSocketId: string = this.getSocketIdFromNickname(
      server,
      invite.from,
    );

    this.emitAcceptedInviteToast(server, client, userSocketId);

    // create room name
    const roomName: string = this.createRoomName(client.id, userSocketId);

    // create match
    await this.gameService.createMatchHistory(
      client.id,
      userSocketId,
      roomName,
    );

    // add users to roomFromPlayer
    this.roomFromPlayer.set(client.id, roomName);
    this.roomFromPlayer.set(userSocketId, roomName);

    const userSocket = server.sockets.sockets.get(userSocketId);
    client.join(roomName);
    userSocket.join(roomName);

    const players: PlayersInterface = {
      player1ftId: client.id,
      player2ftId: userSocketId,
      player1Nickname: this.getNicknameFromClient(client),
      player2Nickname: this.getNicknameFromClient(userSocket),
    };

    // create pong game
    const pongGame: PongService = new PongService(this.gameService, players);

    // asign pong game to room
    this.pongGames.set(roomName, pongGame);

    // get pong game state
    const pongGameState = pongGame.getGameState();

    // emit game state to all users in room
    server.to(roomName).emit('toGame', pongGameState);

    // remove invite
    this.inviteUsers = this.inviteUsers.filter(
      (invite) => invite.from !== userNickname,
    );
  }

  async declineInvite(
    client: Socket,
    server: Server,
    userNickname: string,
  ): Promise<void> {
    // exist invite
    if (!this.existInvite(client, userNickname)) {
      this.emitErrorToast(client, server, 'Não existe convite');
      return;
    }

    // get invite
    const invite: InviteInterface = this.inviteUsers.find(
      (invite) =>
        invite.to === this.getNicknameFromClient(client) &&
        invite.from === userNickname,
    );

    // emit invite declined to user that sent invite
    const userSocketId: string = this.getSocketIdFromNickname(
      server,
      invite.from,
    );

    this.emitDeclinedInviteToast(server, client, userSocketId);

    // remove invite
    this.inviteUsers = this.inviteUsers.filter(
      (invite) =>
        invite.to !== this.getNicknameFromClient(client) ||
        invite.from !== userNickname,
    );
  }

  spectatorOut(client: Socket, server: Server): void {
    this.leaveAllRooms(server, client);
  }

  private leaveAllRooms(server: Server, client: Socket): void {
    const rooms: string[] = this.getAllRoomsFromSocket(server, client);

    for (const room of rooms) {
      client.leave(room);
    }
  }

  private getAllRoomsFromSocket(server: Server, client: Socket): string[] {
    const rooms: string[] = [];
    const roomsIterator = server.sockets.adapter.rooms.entries();

    for (const room of roomsIterator) {
      if (room[1].has(client.id)) {
        rooms.push(room[0]);
      }
    }
    return rooms;
  }

  private emitDeclinedInviteToast(
    server: Server,
    client: Socket,
    socketId: string,
  ): void {
    const toast: ToastInterface = this.createToast(
      'info',
      'O usuário ' + client.id + ' recusou seu convite',
      false,
    );

    server.to(socketId).emit('sendToast', toast);
  }

  private emitDuplicateInviteToast(
    server: Server,
    client: Socket,
    userNickname: string,
  ): void {
    const toast: ToastInterface = this.createToast(
      'warning',
      'Você já convidou o usuário ' + userNickname,
      false,
    );

    server.to(client.id).emit('sendToast', toast);
  }

  private emitAcceptedInviteToast(
    server: Server,
    client: Socket,
    socketId: string,
  ): void {
    const toast: ToastInterface = this.createToast(
      'info',
      'O usuário ' + client.id + ' aceitou seu convite',
      false,
      undefined,
      true,
    );

    server.to(socketId).emit('sendToast', toast);
  }

  private existInvite(client: Socket, userNickname: string): boolean {
    for (const invite of this.inviteUsers) {
      if (
        invite.to === this.getNicknameFromClient(client) &&
        invite.from === userNickname
      ) {
        return true;
      }
    }
    return false;
  }

  private inviteDuplicated(client: Socket, userNickname: string): boolean {
    for (const invite of this.inviteUsers) {
      if (
        invite.from === this.getNicknameFromClient(client) &&
        invite.to === userNickname
      ) {
        return true;
      }
    }
    return false;
  }

  private socketIsConnected(server: Server, nickname: string): boolean {
    let isConnected = false;

    server.sockets.sockets.forEach((socket) => {
      if (socket.handshake.query.nickname === nickname) {
        isConnected = true;
      }
    });

    return isConnected;
  }

  private createToast(
    info: string,
    message: string,
    isInvite: boolean,
    data?: {
      [key: string]: string;
    },
    is_invite_accepted?: boolean,
  ): ToastInterface {
    return {
      info: info,
      message: message,
      is_invite: isInvite,
      data,
      is_invite_accepted,
    };
  }

  private emitErrorToast(
    socket: Socket,
    server: Server,
    message: string,
  ): void {
    const toast: ToastInterface = this.createToast('error', message, false);

    server.to(socket.id).emit('sendToast', toast);
  }

  private emitInviteToast(
    server: Server,
    client: Socket,
    nickname: string,
    data: InviteInterface,
  ): void {
    const socketNickname: string = this.getNicknameFromClient(client);
    const socketId: string = this.getSocketIdFromNickname(server, nickname);
    const toast: ToastInterface = this.createToast(
      'info',
      'Usuário ' + socketNickname + ' enviou um convite para partida',
      true,
      { ...data },
    );
    console.log('socket id: ', socketId);

    server.to(socketId).emit('sendToast', toast);
  }

  private getSocketIdFromNickname(server: Server, nickname: string): string {
    let socketID = '';

    server.sockets.sockets.forEach((socket) => {
      if (socket.handshake.query.nickname === nickname) {
        socketID = socket.id;
      }
    });

    return socketID;
  }

  private getNicknameFromClient(client: Socket): string {
    const nickname: string = client.handshake.query.nickname.toString();

    return nickname ? nickname : client.id;
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
      if (room !== client.id) client.leave(room);
    }
  }
}
