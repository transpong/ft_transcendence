import { Injectable } from '@nestjs/common';
import { ChannelEntity } from '../entity/channel.entity';
import { Repository } from 'typeorm';
import { UsersChannelsEntity } from '../entity/user-channels.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DirectMessagesEntity } from '../entity/direct-messages.entity';
import { UserService } from '../../user/service/user.service';
import { UserEntity } from '../../user/entity/user.entity';
import { AccessType } from '../enum/access-type.enum';
import * as bcrypt from 'bcrypt';

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

  async createChat(ft_id: string, password: string): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ft_id);

    const channel = new ChannelEntity();
    channel.name = user.ftId;
    channel.createdAt = new Date();
    channel.updatedAt = new Date();
    channel.type = AccessType.PRIVATE;
    channel.passwordSalt = await bcrypt.genSalt();
    channel.passwordHash = await bcrypt.hash(password, channel.passwordSalt);
    channel.users_channels = [];
    channel.users_channels = [];
    channel.channel_messages = [];
    await this.channelRepository.save(channel);
  }
}
