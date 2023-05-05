import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [UserEntity, MatchHistoryEntity, ChannelEntity, UsersChannelsEntity, DirectMessagesEntity, ChannelMessagesEntity],
      synchronize: true,
      dropSchema: true,
    }),
    UserModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
