import { UsersChannelsEntity } from '../../entity/user-channels.entity';

export class ChatOutputDto {
  id: number;
  name: string;
  type: number;
  userAccessType: number;
  bannedAt: Date;
  kickedAt: Date;
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
}
