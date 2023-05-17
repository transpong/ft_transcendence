import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class GatewayAdapter extends IoAdapter {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(UserService)
    private userService: UserService,
    private app: INestApplicationContext,
  ) {
    super(app);
  }

  private socketIdList: string[] = [];

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);

    server.use(this.verifyToken.bind(this));
    server.use(this.setSocketUserId.bind(this));

    server.on('connection', (socket: any) => {
      this.socketIdList.push(socket.id);
      socket.on('disconnect', () => {
        this.socketIdList = this.socketIdList.filter((id) => id !== socket.id);
      });
    });

    return server;
  }

  private verifyToken(socket: any, next: any): void {
    const tokenPayload: string = socket.handshake.headers.authorization;

    if (!tokenPayload) {
      return next(new Error('Token not provided'));
    }

    const [method, token] = tokenPayload.split(' ');

    if (method !== 'Bearer') {
      return next(new Error('Invalid token only Bearer is allowed'));
    }

    try {
      this.jwtService.verify(token, {
        secret: `${process.env.JWT_SECRET}`,
      });
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  }

  private async setSocketUserId(socket: any, next: any): Promise<void> {
    const tokenPayload: string = socket.handshake.headers.authorization;
    const decoded = this.jwtService.verify(tokenPayload.split(' ')[1], {
      secret: `${process.env.JWT_SECRET}`,
    });

    if (this.socketIdList.includes(decoded.req)) {
      return next(new Error('User already connected'));
    }

    const user: UserEntity = await this.userService.getUserByFtId(decoded.req);
    socket.id = user.ftId;
    next();
  }
}
