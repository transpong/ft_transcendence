import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from '../../user/service/user.service';

@WebSocketGateway()
export class GatewayService {
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: any;
  users = 0;

  async handleConnection(client: Socket) {
    this.users++;

    // Notify connected clients of current users
    this.server.emit('users', this.users);

    client.broadcast.emit('chat', 'test');
  }

  async handleDisconnect() {
    // A client has disconnected
    this.users--;

    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('chat')
  async onChat(client, message) {
    client.broadcast.emit('chat', message);
    console.log(message);
    client.broadcast.emit('message sent', message);
    this.server.emit('chat', message);
  }

  // send to all connected clients
  async sendToAll(message: string) {
    this.server.emit('chat', message);
  }
}
