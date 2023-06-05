import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserEnum } from 'src/user/enum/user.enum';
import { UserService } from 'src/user/service/user.service';
import { RoomService } from './room.service';

@WebSocketGateway({ cors: true })
export class GatewayService {
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket): Promise<void> {
    console.log('User: ' + client.handshake.query.nickname + ' connected');
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.roomService.endGame(client, this.server);
    console.log('User: ' + client.handshake.query.nickname + ' disconnected');
    await this.userService.updateStatus(client.id, UserEnum.OFFLINE);
    // await this.roomService.debug();
  }

  @SubscribeMessage('joinRoom')
  async handleRoom(client: Socket): Promise<void> {
    await this.roomService.joinWaitingRoom(client, this.server);
  }

  @SubscribeMessage('startGame')
  async handleStartGame(client: Socket): Promise<void> {
    await this.roomService.startGame(client, this.server);
  }

  @SubscribeMessage('moveUp')
  async handleMoveUp(client: Socket): Promise<void> {
    await this.roomService.moveUp(client);
  }

  @SubscribeMessage('moveDown')
  async handleMoveDown(client: Socket): Promise<void> {
    await this.roomService.moveDown(client);
  }

  @SubscribeMessage('endGame')
  async handleEndGame(client: Socket): Promise<void> {
    console.log('end game called');
    await this.roomService.endGame(client, this.server);
  }

  @SubscribeMessage('enterSpectator')
  async handleEnterSpectator(client: Socket, roomName: string): Promise<void> {
    await this.roomService.enterSpectator(client, roomName);
  }

  @SubscribeMessage('test')
  async handleTest(client: Socket, data: any): Promise<void> {
    console.log('test');
  }

  @SubscribeMessage('invite')
  async handleInvite(client: Socket, userNickname: string): Promise<void> {
    await this.roomService.inviteUser(client, this.server, userNickname);
  }

  @SubscribeMessage('acceptInvite')
  async handleAcceptInvite(
    client: Socket,
    userNickname: string,
  ): Promise<void> {
    await this.roomService.acceptInvite(client, this.server, userNickname);
  }

  @SubscribeMessage('declineInvite')
  async handleDeclineInvite(
    client: Socket,
    userNickname: string,
  ): Promise<void> {
    await this.roomService.declineInvite(client, this.server, userNickname);
  }

  @SubscribeMessage('spectatorOut')
  handleSpectatorOut(client: Socket): void {
    this.roomService.spectatorOut(client, this.server);
  }
}
