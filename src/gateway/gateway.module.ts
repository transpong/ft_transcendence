import { Module } from '@nestjs/common';
import { GatewayService } from './service/gateway.service';
import { JwtModule } from '@nestjs/jwt';
import { PongService } from './service/pong.service';
import { GameModule } from '../game/game.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    GameModule,
  ],
  providers: [GatewayService, PongService],
})
export class GatewayModule {}
