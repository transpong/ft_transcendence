import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
@WebSocketGateway()
export class GatewayService {
  @WebSocketServer()
  server: any;
  users = 0;

  async handleConnection(client: Socket) {
    // get total number of connected clients

    // A client has connected
    console.log(client.handshake.headers.token);
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
