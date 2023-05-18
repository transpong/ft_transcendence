import { IsNotEmpty, IsString } from 'class-validator';
import { ChannelEntity } from '../../entity/channel.entity';
import { UserEntity } from '../../../user/entity/user.entity';
import { ChannelMessagesEntity } from '../../entity/channelmessages.entity';
import { DirectMessagesEntity } from '../../entity/direct-messages.entity';

export class MessageInputDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  static toMessageChannelEntity(
    dto: MessageInputDto,
    channel: ChannelEntity,
    user: UserEntity,
  ): ChannelMessagesEntity {
    const messageChannel: ChannelMessagesEntity = new ChannelMessagesEntity();

    messageChannel.messageText = dto.message;
    messageChannel.user = user;
    messageChannel.channel = channel;
    return messageChannel;
  }

  static toDirectMessagesEntity(
    dto: MessageInputDto,
    fromUser: UserEntity,
    toUser: UserEntity,
  ): DirectMessagesEntity {
    const messageDirect: DirectMessagesEntity = new DirectMessagesEntity();

    messageDirect.messageText = dto.message;
    messageDirect.fromUser = fromUser;
    messageDirect.toUser = toUser;
    return messageDirect;
  }
}
