import { UsersChannelsEntity } from '../../entity/user-channels.entity';
import { classToPlain, Expose } from '@nestjs/class-transformer';

export class ChatOutputDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'type' })
  type: number;

  @Expose({ name: 'user_access_type' })
  userAccessType: number;

  @Expose({ name: 'banned_at' })
  bannedAt: Date;

  @Expose({ name: 'kicked_at' })
  kickedAt: Date;

  @Expose({ name: 'muted_until' })
  mutedUntil: Date;

  static fromUsersChannelsList(usersChannels: UsersChannelsEntity[]) {
    const dtoList: ChatOutputDto[] = [];

    for (const userChannel of usersChannels) {
      const dto: ChatOutputDto = new ChatOutputDto();

      dto.id = userChannel.channel.id;
      dto.name = userChannel.channel.name;
      dto.type = userChannel.channel.type;
      dto.userAccessType = userChannel.userAccessType;
      dto.bannedAt = userChannel.bannedAt;
      dto.kickedAt = userChannel.kickedAt;
      dto.mutedUntil = userChannel.mutedUntil;
      dtoList.push(dto);
    }
    return dtoList;
  }

  toJSON() {
    return classToPlain(this);
  }
}
