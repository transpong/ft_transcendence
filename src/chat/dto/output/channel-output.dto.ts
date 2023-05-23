import { ChatOutputDto } from './chat-output.dto';
import { UsersChannelsEntity } from '../../entity/user-channels.entity';
import { classToPlain, Expose } from '@nestjs/class-transformer';
import { UserEntity } from '../../../user/entity/user.entity';
import { UserProfileDto } from '../../../user/dto/user-profile.dto';
import { ChannelEntity } from '../../entity/channel.entity';

export class ChannelOutputDto {
  @Expose({ name: 'channels' })
  channels: ChatOutputDto[];

  @Expose({ name: 'other_channels' })
  otherChannels: ChatOutputDto[];

  @Expose({ name: 'friends' })
  friends: UserProfileDto[];

  @Expose({ name: 'other_users' })
  otherUsers: UserProfileDto[];

  static getChats(
    user: UserEntity,
    otherUsers: UserEntity[],
    usersChannels: UsersChannelsEntity[],
    unrelated: ChannelEntity[],
  ): ChannelOutputDto {
    const channelOutputDto: ChannelOutputDto = new ChannelOutputDto();

    channelOutputDto.channels =
      ChatOutputDto.fromUsersChannelsList(usersChannels);
    channelOutputDto.otherChannels = ChatOutputDto.fromChannelList(
      unrelated,
      user.nickname,
    );
    channelOutputDto.friends = user.friends.map((friend) =>
      UserProfileDto.fromEntity(user, friend),
    );
    channelOutputDto.otherUsers = otherUsers.map((otherUser) =>
      UserProfileDto.fromEntity(user, otherUser),
    );
    return channelOutputDto;
  }

  toJSON() {
    return classToPlain(this);
  }
}
