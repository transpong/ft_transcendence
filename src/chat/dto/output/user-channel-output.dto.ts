import { classToPlain, Expose } from '@nestjs/class-transformer';
import { UsersChannelsEntity } from '../../entity/user-channels.entity';

export class UserChannelOutputDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'ft_id' })
  ftLogin: string;

  @Expose({ name: 'nickname' })
  nickname: string;

  @Expose({ name: 'avatar' })
  avatar: string;

  @Expose({ name: 'status' })
  status: number;

  @Expose({ name: 'banned_at' })
  bannedAt: Date;

  @Expose({ name: 'kicked_at' })
  kickedAt: Date;

  @Expose({ name: 'muted_until' })
  mutedUntil: Date;

  @Expose({ name: 'user_access_type' })
  userAccessType: number;

  static toDto(usersChannel: UsersChannelsEntity): UserChannelOutputDto {
    const userDto: UserChannelOutputDto = new UserChannelOutputDto();

    userDto.id = usersChannel.id;
    userDto.ftLogin = usersChannel.user.ftId;
    userDto.nickname = usersChannel.user.nickname;
    userDto.avatar = usersChannel.user.avatar;
    userDto.status = usersChannel.user.status;
    userDto.bannedAt = usersChannel.bannedAt;
    userDto.kickedAt = usersChannel.kickedAt;
    userDto.mutedUntil = usersChannel.mutedUntil;
    userDto.userAccessType = usersChannel.userAccessType;
    return userDto;
  }

  static toDtoList(users: UsersChannelsEntity[]): UserChannelOutputDto[] {
    const usersList: UserChannelOutputDto[] = [];

    for (const user of users) {
      usersList.push(this.toDto(user));
    }
    return usersList;
  }

  toJSON() {
    return classToPlain(this);
  }
}
