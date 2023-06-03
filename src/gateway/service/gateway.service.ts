import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../../game/service/game.service';
import { RoomService } from './room.service';

@WebSocketGateway({ cors: true })
export class GatewayService {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  private readonly roomService: RoomService = new RoomService(this.gameService);

  async handleConnection(client: Socket): Promise<void> {
    console.log('User: ' + client.handshake.query.nickname + ' connected');
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.roomService.endGame(client, this.server);
    console.log('User: ' + client.handshake.query.nickname + ' disconnected');
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
  async handleAcceptInvite(client: Socket): Promise<void> {
    await this.roomService.acceptInvite(client, this.server);
  }

  @SubscribeMessage('declineInvite')
  async handleDeclineInvite(client: Socket): Promise<void> {
    await this.roomService.declineInvite(client, this.server);
  }

  @SubscribeMessage('spectatorOut')
  async handleSpectatorOut(client: Socket): Promise<void> {
    await this.roomService.spectatorOut(client, this.server);
  }
}
