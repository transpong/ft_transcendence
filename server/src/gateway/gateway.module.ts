import { Module } from '@nestjs/common';
import { GatewayService } from './service/gateway.service';
import { JwtModule } from '@nestjs/jwt';
import { GameModule } from '../game/game.module';
import { UserModule } from 'src/user/user.module';
import { RoomService } from './service/room.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    GameModule,
    UserModule,
  ],
  providers: [GatewayService, RoomService],
})
export class GatewayModule {}
