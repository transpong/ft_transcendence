import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from '../../game/service/game.service';
import { RoomService } from './room.service';

@WebSocketGateway({ cors: true })
export class GatewayService {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: any;

  private readonly roomService = new RoomService(this.gameService);

  async handleConnection(client: Socket) {
    console.log('User: ' + client.id + ' connected');
  }

  async handleDisconnect(client: Socket) {
    await this.roomService.endGame(client, this.server);
    console.log('User: ' + client.id + ' disconnected');
    // await this.roomService.debug();
  }

  @SubscribeMessage('joinRoom')
  async handleRoom(client: Socket) {
    await this.roomService.joinWaitingRoom(client, this.server);
  }

  @SubscribeMessage('startGame')
  async handleStartGame(client: Socket) {
    await this.roomService.startGame(client, this.server);
  }

  @SubscribeMessage('moveUp')
  async handleMoveUp(client: Socket) {
    await this.roomService.moveUp(client);
  }

  @SubscribeMessage('moveDown')
  async handleMoveDown(client: Socket) {
    await this.roomService.moveDown(client);
  }

  @SubscribeMessage('endGame')
  async handleEndGame(client: Socket) {
    console.log('end game');
    await this.roomService.endGame(client, this.server);
  }

  @SubscribeMessage('enterSpectator')
  async handleEnterSpectator(client: Socket, roomName: string) {
    await this.roomService.enterSpectator(client, roomName);
  }

  @SubscribeMessage('test')
  async handleTest(client: Socket, data: any) {
    console.log('test');
    console.log(data);
  }
}
