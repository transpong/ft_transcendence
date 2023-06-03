import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { UserEnum } from '../../user/enum/user.enum';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class GatewayAdapter extends IoAdapter {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private app: INestApplicationContext,
  ) {
    super(app);
  }

  private socketIdList: string[] = [];

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);

    server.use(this.verifyIsCustom.bind(this));
    server.use(this.verifyToken.bind(this));
    server.use(this.setSocketUserId.bind(this));

    server.on('connection', (socket: any) => {
      this.socketIdList.push(socket.id);
      this.userService.updateStatus(socket.id, UserEnum.ONLINE);
      socket.on('disconnect', () => {
        this.socketIdList = this.socketIdList.filter((id) => id !== socket.id);
        this.userService.updateStatus(socket.id, UserEnum.OFFLINE);
      });
    });

    return server;
  }

  private verifyIsCustom(socket: any, next: any): void {
    const isCustom: boolean = socket.handshake.headers.custom;

    if (!isCustom) {
      return next(new Error('Custom header not provided'));
    }
    next();
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
      return next(new Error('User ' + decoded.req + ' already connected'));
    }

    if (!(await this.userService.userExists(decoded.req))) {
      return next(new Error('User not found'));
    }
    const user: UserEntity = await this.userService.getUserByFtId(decoded.req);

    socket.id = decoded.req;
    socket.handshake.query.nickname = user.nickname
      ? user.nickname
      : decoded.req;
    next();
  }
}
