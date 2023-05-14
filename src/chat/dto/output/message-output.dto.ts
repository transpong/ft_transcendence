import { UserEntity } from '../../../user/entity/user.entity';
import { classToPlain, Expose } from '@nestjs/class-transformer';
import { ChannelMessagesEntity } from '../../entity/channelmessages.entity';
import { SenderDto } from './message-sender-output.dto';

export class MessageOutputDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'message_text' })
  messageText: string;

  @Expose({ name: 'sender' })
  sender: SenderDto;

  @Expose({ name: 'am_i_sender' })
  isSender: boolean;

  static toMessageDto(
    channelMessagesEntity: ChannelMessagesEntity,
    user: UserEntity,
  ): MessageOutputDto {
    const messageDto: MessageOutputDto = new MessageOutputDto();

    messageDto.id = channelMessagesEntity.id;
    messageDto.createdAt = channelMessagesEntity.createdAt;
    messageDto.messageText = channelMessagesEntity.messageText;
    messageDto.sender = SenderDto.fromUser(channelMessagesEntity.user);
    messageDto.isSender = user.id === channelMessagesEntity.user.id;
    return messageDto;
  }

  static toMessageDtoList(
    channelMessagesEntityList: ChannelMessagesEntity[],
    user: UserEntity,
  ): MessageOutputDto[] {
    const messageDtoList: MessageOutputDto[] = [];

    for (const channelMessagesEntity of channelMessagesEntityList) {
      messageDtoList.push(this.toMessageDto(channelMessagesEntity, user));
    }
    return messageDtoList;
  }

  toJSON() {
    return classToPlain(this);
  }
}
