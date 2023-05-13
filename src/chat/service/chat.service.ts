import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { ChannelMessagesEntity } from '../entity/channelmessages.entity';
import { MessageInputDto } from '../dto/message-input.dto';

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
    @InjectRepository(ChannelMessagesEntity)
    private readonly channelMessagesRepository: Repository<ChannelMessagesEntity>,
    private readonly userService: UserService,
  ) {}

  async createChat(ftId: string, inputDto: ChannelInputDto): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.makeNewChannel(inputDto);
    const userChannel: UsersChannelsEntity = await this.createUserChannel(
      user,
      channel,
      UserAccessType.OWNER,
    );

    channel.users_channels.push(userChannel);
    await this.channelRepository.save(channel);
  }

  async addUserToChannel(
    ftId: string,
    channelId: number,
    nickname: string,
  ): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);
    const friend: UserEntity = await this.userService.getUserByNickname(
      nickname,
    );
    const userChannel: UsersChannelsEntity = await this.createUserChannel(
      friend,
      channel,
      UserAccessType.MEMBER,
    );

    await this.permissionCheck(user, channel);
    channel.users_channels.push(userChannel);
    await this.channelRepository.save(channel);
  }

  async sendMessageToChannel(
    ftId: string,
    channelId: number,
    dto: MessageInputDto,
  ): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);
    const messageChannel: ChannelMessagesEntity =
      MessageInputDto.toMessageChannelEntity(dto, channel, user);

    if (!channel.userHasWriteAccess(user.nickname)) {
      throw new HttpException(
        'User does not have the required permissions',
        HttpStatus.FORBIDDEN,
      );
    }
    channel.addChannelMessages(messageChannel);
    await this.channelMessagesRepository.save(messageChannel);
  }

  async sendDirectMessage(
    ftId: string,
    nickname: string,
    dto: MessageInputDto,
  ): Promise<void> {
    const fromUser: UserEntity = await this.userService.getUserByFtId(ftId);
    const toUser: UserEntity = await this.userService.getUserByNickname(
      nickname,
    );
    const message: DirectMessagesEntity =
      MessageInputDto.toDirectMessagesEntity(dto, fromUser, toUser);

    await this.directMessagesRepository.save(message);
  }

  async changeChannelType(
    ftId: string,
    channelId: number,
    type: number,
  ): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);

    await this.permissionCheck(user, channel);
    channel.type = type;
    if (channel.isPublic()) {
      channel.deletePassword();
    }
    await this.channelRepository.save(channel);
  }

  async changeChannelPassword(
    ftId: string,
    channelId: number,
    password: string,
  ): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);

    await this.permissionCheck(user, channel);
    channel.passwordSalt = await bcrypt.genSalt();
    channel.passwordHash = await bcrypt.hash(password, channel.passwordSalt);
    await this.channelRepository.save(channel);
  }

  async validateChannelPassword(
    ftId: string,
    channelId: number,
    password: string,
  ): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);

    if (!channel.userHasWriteAccess(user.nickname)) {
      throw new HttpException(
        'User does not have the required permissions',
        HttpStatus.FORBIDDEN,
      );
    }
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      channel.passwordHash,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
  }

  private async permissionCheck(
    user: UserEntity,
    channel: ChannelEntity,
  ): Promise<void> {
    if (!channel.userHasAdminAccess(user.nickname)) {
      throw new HttpException(
        'User does not have the required permissions',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async getChannelById(id: number): Promise<ChannelEntity> {
    const channel: ChannelEntity = await this.channelRepository.findOne({
      where: { id: id },
      relations: ['users_channels', 'users_channels.user', 'channel_messages'],
    });

    if (!channel) {
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    }
    return channel;
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

    if (channel.hasUser(user.nickname)) {
      throw new HttpException('User already in channel', HttpStatus.CONFLICT);
    }
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
