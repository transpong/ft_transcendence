import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity';
import { GameModule } from './game/game.module';
import { MatchHistoryEntity } from './game/entity/game.entity';
import { ChannelEntity } from './chat/entity/channel.entity';
import { UsersChannelsEntity } from './chat/entity/user-channels.entity';
import { DirectMessagesEntity } from './chat/entity/direct-messages.entity';
import { ChannelMessagesEntity } from './chat/entity/channelmessages.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { AvatarModule } from './avatar/avatar.module';
import { ChatModule } from './chat/chat.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [
        UserEntity,
        MatchHistoryEntity,
        ChannelEntity,
        UsersChannelsEntity,
        DirectMessagesEntity,
        ChannelMessagesEntity,
      ],
      synchronize: true,
      //dropSchema: true,
    }),
    UserModule,
    GameModule,
    AuthModule,
    AvatarModule,
    ChatModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
