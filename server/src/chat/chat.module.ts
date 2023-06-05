import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from './entity/channel.entity';
import { ChannelMessagesEntity } from './entity/channelmessages.entity';
import { DirectMessagesEntity } from './entity/direct-messages.entity';
import { UsersChannelsEntity } from './entity/user-channels.entity';
import { ChatController } from './controller/chat.controller';
import { ChatService } from './service/chat.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelEntity,
      ChannelMessagesEntity,
      DirectMessagesEntity,
      UsersChannelsEntity,
    ]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
