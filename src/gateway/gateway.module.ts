import { Module } from '@nestjs/common';
import { GatewayService } from './service/gateway.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
  ],
  providers: [GatewayService],
})
export class GatewayModule {}
