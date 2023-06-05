import { UserEntity } from '../../../user/entity/user.entity';
import { classToPlain, Expose } from '@nestjs/class-transformer';
import { ChannelMessagesEntity } from '../../entity/channelmessages.entity';
import { SenderDto } from './message-sender-output.dto';
import { DirectMessagesEntity } from '../../entity/direct-messages.entity';

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

  static fromDirectMessageEntityList(
    user: UserEntity,
    directMessagesEntityList: DirectMessagesEntity[],
  ): MessageOutputDto[] {
    const messageDtoList: MessageOutputDto[] = [];
    const sortedMessages = directMessagesEntityList.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    for (const directMessagesEntity of sortedMessages) {
      const messageDto: MessageOutputDto = new MessageOutputDto();

      messageDto.id = directMessagesEntity.id;
      messageDto.createdAt = directMessagesEntity.createdAt;
      messageDto.messageText = directMessagesEntity.messageText;
      messageDto.isSender = directMessagesEntity.fromUser.id === user.id;
      messageDtoList.push(messageDto);
    }
    return messageDtoList;
  }

  toJSON() {
    return classToPlain(this);
  }
}
