import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersChannelsEntity } from './user-channels.entity';
import { ChannelMessagesEntity } from './channelmessages.entity';
import { UserAccessType } from '../enum/access-type.enum';
import { AccessType } from '../enum/cannel-type.enum';

@Entity({ name: 'channels' })
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash?: string;

  @Column({ name: 'password_salt', nullable: true })
  passwordSalt?: string;

  @Column({ name: 'type' })
  type: number;

  @OneToMany(
    () => UsersChannelsEntity,
    (usersChannels) => usersChannels.channel,
  )
  users_channels: UsersChannelsEntity[];

  @OneToMany(
    () => ChannelMessagesEntity,
    (channelMessage) => channelMessage.channel,
  )
  channel_messages: ChannelMessagesEntity[];

  hasUser(nickname: string): boolean {
    if (!this.users_channels) return false;

    for (const userChannel of this.users_channels) {
      if (userChannel.user.nickname === nickname) {
        return true;
      }
    }
    return false;
  }

  userHasAdminAccess(nickname: string): boolean {
    const UserAccessValids: UserAccessType[] = [
      UserAccessType.ADMIN,
      UserAccessType.OWNER,
    ];

    if (!this.users_channels) return false;
    for (const userChannel of this.users_channels) {
      if (
        userChannel.user.nickname === nickname &&
        UserAccessValids.includes(userChannel.userAccessType)
      ) {
        return true;
      }
    }
    return false;
  }

  userHasWriteAccess(nickname: string): boolean {
    const UserAccessValids: UserAccessType[] = [
      UserAccessType.ADMIN,
      UserAccessType.OWNER,
      UserAccessType.MEMBER,
    ];

    if (!this.users_channels) return false;
    for (const userChannel of this.users_channels) {
      if (
        userChannel.user.nickname === nickname &&
        !this.userIsBanned(nickname)
      ) {
        if (UserAccessValids.includes(userChannel.userAccessType)) {
          return true;
        }
      }
    }
    return false;
  }

  addChannelMessages(message: ChannelMessagesEntity): void {
    if (!this.channel_messages) {
      this.channel_messages = [];
    }
    this.channel_messages.push(message);
  }

  isPublic(): boolean {
    return this.type === AccessType.PUBLIC;
  }

  isProtected(): boolean {
    return this.type === AccessType.PROTECTED;
  }

  isPrivate(): boolean {
    return this.type === AccessType.PRIVATE;
  }

  deletePassword(): void {
    this.passwordHash = null;
    this.passwordSalt = null;
  }

  userIsOwner(nickname: string): boolean {
    for (const userChannel of this.users_channels) {
      if (userChannel.user.nickname === nickname) {
        return userChannel.userAccessType === UserAccessType.OWNER;
      }
    }
  }

  getUserChannel(nickname: string): UsersChannelsEntity {
    for (const userChannel of this.users_channels) {
      if (userChannel.user.nickname === nickname) {
        return userChannel;
      }
    }
  }

  getSortedMessages(): ChannelMessagesEntity[] {
    if (!this.channel_messages) return [];
    return this.channel_messages.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  isPasswordProtected(): boolean {
    return this.passwordHash !== null && this.passwordSalt !== null;
  }

  userIsBanned(nickname: string): boolean {
    for (const userChannel of this.users_channels) {
      if (userChannel.user.nickname === nickname) {
        return userChannel.bannedAt !== null;
      }
    }
    return false;
  }

  userIsKicked(nickname: string): boolean {
    for (const userChannel of this.users_channels) {
      if (userChannel.user.nickname === nickname) {
        return userChannel.kickedAt !== null;
      }
    }
    return false;
  }

  userIsMuted(nickname: string): boolean {
    for (const userChannel of this.users_channels) {
      if (userChannel.user.nickname === nickname) {
        return this.checkMutted(userChannel.mutedUntil);
      }
    }
    return false;
  }

  hasAdmin(): boolean {
    for (const userChannel of this.users_channels) {
      if (userChannel.userAccessType === UserAccessType.ADMIN) {
        return true;
      }
    }
    return false;
  }

  hasMember(): boolean {
    for (const userChannel of this.users_channels) {
      if (userChannel.userAccessType === UserAccessType.MEMBER) {
        return true;
      }
    }
    return false;
  }

  private checkMutted(muttedUntil: Date): boolean {
    if (muttedUntil > new Date()) {
      return true;
    } else if (muttedUntil !== null && muttedUntil < new Date()) {
      muttedUntil = null;
      return false;
    }
  }
}
