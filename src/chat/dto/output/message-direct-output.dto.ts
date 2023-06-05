import { SenderDto } from './message-sender-output.dto';
import { classToPlain, Expose } from '@nestjs/class-transformer';
import { MessageOutputDto } from './message-output.dto';
import { UserEntity } from '../../../user/entity/user.entity';
import { DirectMessagesEntity } from '../../entity/direct-messages.entity';

export class MessageDirectOutputDto {
  @Expose({ name: 'user' })
  user: SenderDto;

  messages: MessageOutputDto[];

  static fromDirectMessageEntityList(
    user: UserEntity,
    toUser: UserEntity,
    directMessagesEntityList: DirectMessagesEntity[],
  ) {
    const messageOutputDto: MessageDirectOutputDto =
      new MessageDirectOutputDto();

    messageOutputDto.user = SenderDto.fromUser(toUser);
    messageOutputDto.messages = MessageOutputDto.fromDirectMessageEntityList(
      user,
      directMessagesEntityList,
    );

    return messageOutputDto;
  }

  static fromDirectMessageEntity(user: UserEntity): SenderDto {
    return SenderDto.fromUser(user);
  }

  toJSON() {
    return classToPlain(this);
  }
}
