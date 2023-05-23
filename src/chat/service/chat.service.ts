import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChannelEntity } from '../entity/channel.entity';
import { Not, Repository } from 'typeorm';
import { UsersChannelsEntity } from '../entity/user-channels.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DirectMessagesEntity } from '../entity/direct-messages.entity';
import { UserService } from '../../user/service/user.service';
import { UserEntity } from '../../user/entity/user.entity';
import { UserAccessType } from '../enum/access-type.enum';
import * as bcrypt from 'bcrypt';
import { ChannelInputDto } from '../dto/input/channel-input.dto';
import { ChannelMessagesEntity } from '../entity/channelmessages.entity';
import { MessageInputDto } from '../dto/input/message-input.dto';
import { UserChannelOutputDto } from '../dto/output/user-channel-output.dto';
import { MessageOutputDto } from '../dto/output/message-output.dto';
import { MessageDirectOutputDto } from '../dto/output/message-direct-output.dto';
import { AccessType } from '../enum/cannel-type.enum';
import { ChannelOutputDto } from '../dto/output/channel-output.dto';

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

    if (!channel.userHasWriteAccess(user.nickname) && !channel.isPublic()) {
      throw new HttpException(
        'User does not have the required permissions',
        HttpStatus.FORBIDDEN,
      );
    }

    if (channel.isPublic() && !channel.hasUser(user.nickname)) {
      await this.enterPublicChannel(user, channel);
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
    if (channel.isProtected() && !channel.isPasswordProtected()) {
      throw new HttpException(
        'Protected channel must have a password',
        HttpStatus.BAD_REQUEST,
      );
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
    channel.type = AccessType.PROTECTED;
    await this.channelRepository.save(channel);
  }

  async validateChannelPassword(
    ftId: string,
    channelId: number,
    password: string,
  ): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);

    if (!channel.isPasswordProtected()) {
      throw new HttpException(
        'Public channel does not have a password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      channel.passwordHash,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    await this.enterProtectedChannel(user, channel);
  }

  async getChannelUsers(ftId: string, channelId: number) {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);

    if (!channel.userHasWriteAccess(user.nickname)) {
      throw new HttpException(
        'User does not have the required permissions',
        HttpStatus.FORBIDDEN,
      );
    }
    return UserChannelOutputDto.toDtoList(channel.users_channels);
  }

  async removeUserFromChannel(
    ftId: string,
    channelId: number,
    nickname: string,
  ): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);
    const friend: UserEntity = await this.userService.getUserByNickname(
      nickname,
    );
    await this.permissionCheck(user, channel);

    if (!channel.hasUser(friend.nickname)) {
      throw new HttpException(
        'User ' + friend.nickname + ' is not in channel',
        HttpStatus.NOT_FOUND,
      );
    }

    if (channel.userIsOwner(friend.nickname)) {
      throw new HttpException(
        'Cannot remove owner from channel',
        HttpStatus.FORBIDDEN,
      );
    }

    const userChannel: UsersChannelsEntity = channel.getUserChannel(
      friend.nickname,
    );

    await this.usersChannelsRepository.remove(userChannel);
  }

  async changeUserAccessType(
    ftId: string,
    channelId: number,
    nickname: string,
    type: number,
  ): Promise<void> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);
    const friend: UserEntity = await this.userService.getUserByNickname(
      nickname,
    );
    await this.permissionCheck(user, channel);

    if (!channel.hasUser(friend.nickname)) {
      throw new HttpException(
        'User ' + friend.nickname + ' is not in channel',
        HttpStatus.NOT_FOUND,
      );
    }

    if (channel.userIsOwner(friend.nickname)) {
      throw new HttpException(
        'Cannot change owner access type',
        HttpStatus.FORBIDDEN,
      );
    }

    const userChannel: UsersChannelsEntity = channel.getUserChannel(
      friend.nickname,
    );

    userChannel.userAccessType = type;
    await this.usersChannelsRepository.save(userChannel);
  }

  async changeUserRestrictions(
    ftId: string,
    channelId: number,
    nickname: string,
    restrictions: string,
  ): Promise<void> {
    await this.validateRestrictions(restrictions);
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);
    const friend: UserEntity = await this.userService.getUserByNickname(
      nickname,
    );
    await this.permissionCheck(user, channel);

    if (!channel.hasUser(friend.nickname)) {
      throw new HttpException(
        'User ' + friend.nickname + ' is not in channel',
        HttpStatus.NOT_FOUND,
      );
    }

    if (channel.userIsOwner(friend.nickname)) {
      throw new HttpException(
        'Cannot change owner restrictions',
        HttpStatus.FORBIDDEN,
      );
    }

    const userChannel: UsersChannelsEntity = channel.getUserChannel(
      friend.nickname,
    );

    userChannel.updateRestriction(restrictions);
    await this.usersChannelsRepository.save(userChannel);
  }

  async getChannelMessages(
    ftId: string,
    channelId: number,
  ): Promise<MessageOutputDto[]> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const channel: ChannelEntity = await this.getChannelById(channelId);

    if (!channel.userHasWriteAccess(user.nickname)) {
      throw new HttpException(
        'User does not have the required permissions',
        HttpStatus.FORBIDDEN,
      );
    }

    return MessageOutputDto.toMessageDtoList(channel.getSortedMessages(), user);
  }

  async getDirectMessages(
    ftId: string,
    nickname: string,
  ): Promise<MessageDirectOutputDto> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const friend: UserEntity = await this.userService.getUserByNickname(
      nickname,
    );
    const directMessages: DirectMessagesEntity[] =
      await this.findDirectMessages(user, friend);

    return MessageDirectOutputDto.fromDirectMessageEntityList(
      user,
      friend,
      directMessages,
    );
  }

  async getChats(ftId: string): Promise<ChannelOutputDto> {
    const user: UserEntity = await this.userService.getUserByFtId(ftId);
    const userChannels: UsersChannelsEntity[] =
      await this.findUnbannedChannelsByUserFtId(user.ftId);
    const unrelatedPublicChannels =
      await this.findUnrelatedPublicChannelsByUserFtId(userChannels);
    const usersNotFriends: UserEntity[] =
      await this.userService.getNotFriendsByFtId(user);

    return ChannelOutputDto.getChats(
      user,
      usersNotFriends,
      userChannels,
      unrelatedPublicChannels,
    );
  }

  private async enterPublicChannel(
    user: UserEntity,
    channel: ChannelEntity,
  ): Promise<void> {
    if (!channel.hasUser(user.nickname) && channel.type === AccessType.PUBLIC) {
      const userChannel: UsersChannelsEntity = await this.createUserChannel(
        user,
        channel,
        UserAccessType.MEMBER,
      );

      channel.users_channels.push(userChannel);
      await this.channelRepository.save(channel);
    }
  }

  private async enterProtectedChannel(
    user: UserEntity,
    channel: ChannelEntity,
  ): Promise<void> {
    if (
      !channel.hasUser(user.nickname) &&
      channel.type === AccessType.PROTECTED
    ) {
      const userChannel: UsersChannelsEntity = await this.createUserChannel(
        user,
        channel,
        UserAccessType.MEMBER,
      );

      channel.users_channels.push(userChannel);
      await this.channelRepository.save(channel);
    }
  }

  private async findUnrelatedPublicChannelsByUserFtId(
    userChannels: UsersChannelsEntity[],
  ) {
    const userChannelIds: number[] = userChannels.map(
      (userChannel) => userChannel.channel.id,
    );

    const notPrivateChannels: ChannelEntity[] =
      await this.channelRepository.find({
        where: [
          {
            type: Not(AccessType.PRIVATE),
          },
        ],
        relations: ['users_channels', 'users_channels.user'],
      });

    return notPrivateChannels.filter((channel) => {
      return !userChannelIds.includes(channel.id);
    });
  }

  private async findUnbannedChannelsByUserFtId(
    ftId: string,
  ): Promise<UsersChannelsEntity[]> {
    return await this.usersChannelsRepository.find({
      where: { user: { ftId: ftId }, bannedAt: null },
      relations: [
        'user',
        'user.friends',
        'user.blocks',
        'user.blockedBy',
        'channel',
      ],
    });
  }

  private async findDirectMessages(
    fromUser: UserEntity,
    toUser: UserEntity,
  ): Promise<DirectMessagesEntity[]> {
    return await this.directMessagesRepository.find({
      where: [
        {
          fromUser: { id: fromUser.id },
          toUser: { id: toUser.id },
        },
        {
          fromUser: { id: toUser.id },
          toUser: { id: fromUser.id },
        },
      ],
      relations: ['fromUser', 'toUser'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private async permissionCheck(
    user: UserEntity,
    channel: ChannelEntity,
  ): Promise<void> {
    if (!channel.userHasAdminAccess(user.nickname)) {
      throw new HttpException(
        'User' + user.nickname + 'does not have the required permissions',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async validateRestrictions(restrictions: string): Promise<void> {
    const restrictionList: string[] = [
      'block',
      'unblock',
      'kick',
      'unkick',
      'mute',
      'unmute',
    ];

    if (!restrictionList.includes(restrictions)) {
      throw new HttpException('Invalid restriction', HttpStatus.BAD_REQUEST);
    }
  }

  private async getChannelById(id: number): Promise<ChannelEntity> {
    const channel: ChannelEntity = await this.channelRepository.findOne({
      where: { id: id },
      relations: [
        'users_channels',
        'users_channels.user',
        'channel_messages',
        'channel_messages.user',
      ],
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
    channel.type = inputDto.type;
    channel.users_channels = [];
    channel.channel_messages = [];

    if (inputDto.type === AccessType.PROTECTED && !inputDto.password) {
      throw new HttpException(
        'Password is required for protected channels',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (inputDto.password) {
      channel.passwordSalt = await bcrypt.genSalt();
      channel.passwordHash = await bcrypt.hash(
        inputDto.password,
        channel.passwordSalt,
      );
    }
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
