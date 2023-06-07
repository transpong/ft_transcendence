import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersChannelsEntity } from '../../chat/entity/user-channels.entity';
import { DirectMessagesEntity } from '../../chat/entity/direct-messages.entity';
import { MatchHistoryEntity } from '../../game/entity/game.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'ft_id', length: 50, unique: true })
  ftId: string;

  @Column({ name: 'nickname', length: 50, nullable: true })
  nickname?: string;

  @Column({ name: 'avatar', nullable: true })
  avatar?: string;

  @Column({ name: 'mfa_token', nullable: true })
  tokenMFA?: string;

  @Column({ name: 'mfa_validated_at', nullable: true })
  validatedAtMFA?: Date;

  @Column({ name: 'status' })
  status: number;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'friends' })
  friends: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.blockedBy)
  @JoinTable({
    name: 'user_blocks',
    joinColumn: {
      name: 'user_blocker',
    },
    inverseJoinColumn: {
      name: 'user_blocked',
    },
  })
  blocks: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.blocks)
  blockedBy: UserEntity[];

  @OneToMany(() => UsersChannelsEntity, (usersChannels) => usersChannels.user)
  usersChannels: UsersChannelsEntity[];

  @OneToMany(
    () => DirectMessagesEntity,
    (directMessage) => directMessage.fromUser,
  )
  directMessagesFrom: DirectMessagesEntity[];

  @OneToMany(
    () => DirectMessagesEntity,
    (directMessage) => directMessage.toUser,
  )
  directMessagesTo: DirectMessagesEntity[];

  @OneToMany(() => MatchHistoryEntity, (matchHistory) => matchHistory.user1)
  matchHistory1: MatchHistoryEntity[];

  @OneToMany(() => MatchHistoryEntity, (matchHistory) => matchHistory.user2)
  matchHistory2: MatchHistoryEntity[];

  @OneToMany(() => MatchHistoryEntity, (matchHistory) => matchHistory.winner)
  matchHistoryWinner: MatchHistoryEntity[];

  twoFactorValid(): boolean {
    if (this.tokenMFA) {
      return this.validatedAtMFA !== null;
    }
    return true;
  }

  getSortedMessagesFrom(friend: UserEntity): DirectMessagesEntity[] {
    const messages = this.directMessagesFrom.filter(
      (message) => message.toUser.id === friend.id,
    );

    return messages.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }

  addFriend(friend: UserEntity): void {
    if (!this.friends.includes(friend)) {
      this.friends.push(friend);
    }
  }

  removeFriend(friend: UserEntity): void {
    this.friends = this.friends.filter((f) => f.id !== friend.id);
  }

  addBlock(block: UserEntity): void {
    if (!this.blocks.includes(block)) {
      this.blocks.push(block);
    }
  }

  removeBlock(block: UserEntity): void {
    this.blocks = this.blocks.filter((b) => b.id !== block.id);
  }

  isFriend(user: UserEntity): boolean {
    return this.friends.some((friend) => friend.id === user.id);
  }

  isBlocked(user: UserEntity): boolean {
    const blocked = this.blocks.some((block) => block.id === user.id);
    const isBlockedBy = user.blocks.some((block) => block.id === this.id);

    return blocked || isBlockedBy;
  }
}
