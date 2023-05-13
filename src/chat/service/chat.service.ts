import { Injectable } from '@nestjs/common';
import { ChannelEntity } from '../entity/channel.entity';
import { Repository } from 'typeorm';
import { UsersChannelsEntity } from '../entity/user-channels.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DirectMessagesEntity } from '../entity/direct-messages.entity';
import { UserService } from '../../user/service/user.service';
import { UserEntity } from '../../user/entity/user.entity';
import { UserAccessType } from '../enum/access-type.enum';
import * as bcrypt from 'bcrypt';
import { ChannelInputDto } from '../dto/channel-input.dto';

@Injectable()
export class ChatService {
  '';

  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(UsersChannelsEntity)
    private readonly usersChannelsRepository: Repository<UsersChannelsEntity>,
    @InjectRepository(DirectMessagesEntity)
    private readonly directMessagesRepository: Repository<DirectMessagesEntity>,
    @InjectRepository(UsersChannelsEntity)
    private readonly usersChannelsEntityRepository: Repository<UsersChannelsEntity>,
    private readonly userService: UserService,
  ) {}

  async createChat(ft_id: string, inputDto: ChannelInputDto): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ft_id);
    const channel: ChannelEntity = await this.makeNewChannel(inputDto);
    const userChannel: UsersChannelsEntity = await this.createUserChannel(
      user,
      channel,
      UserAccessType.ADMIN,
    );

    channel.users_channels.push(userChannel);
    await this.channelRepository.save(channel);
  }

  private async makeNewChannel(
    inputDto: ChannelInputDto,
  ): Promise<ChannelEntity> {
    const channel: ChannelEntity = new ChannelEntity();

    channel.name = inputDto.name;
    channel.createdAt = new Date();
    channel.updatedAt = new Date();
    channel.type = inputDto.type;
    channel.passwordSalt = await bcrypt.genSalt();
    channel.passwordHash = await bcrypt.hash(
      inputDto.password,
      channel.passwordSalt,
    );
    channel.users_channels = [];
    channel.channel_messages = [];
    return channel;
  }

  private async createUserChannel(
    user: UserEntity,
    channel: ChannelEntity,
    accessType: UserAccessType,
  ): Promise<UsersChannelsEntity> {
    const userChannel: UsersChannelsEntity = new UsersChannelsEntity();

    userChannel.createdAt = new Date();
    userChannel.update();
    userChannel.userAccessType = accessType;
    userChannel.mutedUntil = null;
    userChannel.kickedAt = null;
    userChannel.bannedAt = null;
    userChannel.user = user;
    userChannel.channel = channel;
    await this.usersChannelsRepository.save(userChannel);
    return userChannel;
  }
}
