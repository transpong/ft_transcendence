import { ChatOutputDto } from './chat-output.dto';
import { UsersChannelsEntity } from '../../entity/user-channels.entity';
import { Expose } from '@nestjs/class-transformer';
import { UserDto } from '../../../user/dto/user.dto';
import { UserEntity } from '../../../user/entity/user.entity';

export class ChannelOutputDto {
  @Expose({ name: 'channels' })
  channels: ChatOutputDto[];

  @Expose({ name: 'other_channels' })
  otherChannels: ChatOutputDto[];

  @Expose({ name: 'friends' })
  friends: UserDto[];

  @Expose({ name: 'other_users' })
  otherUsers: UserDto[];

  static getChats(
    user: UserEntity,
    otherUsers: UserEntity[],
    usersChannels: UsersChannelsEntity[],
    unrelated: UsersChannelsEntity[],
  ): ChannelOutputDto {
    const channelOutputDto: ChannelOutputDto = new ChannelOutputDto();

    channelOutputDto.channels =
      ChatOutputDto.fromUsersChannelsList(usersChannels);
    channelOutputDto.otherChannels =
      ChatOutputDto.fromUsersChannelsList(unrelated);
    channelOutputDto.friends = user.friends.map((friend) =>
      UserDto.fromEntity(friend),
    );
    channelOutputDto.otherUsers = otherUsers.map((otherUser) =>
      UserDto.fromEntity(otherUser),
    );
    return channelOutputDto;
  }
}
