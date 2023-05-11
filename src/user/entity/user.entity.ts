import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
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
  nickname: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'mfa_token', nullable: true })
  tokenMFA: string;

  @Column({ name: 'mfa_validated_at', nullable: true })
  validatedAtMFA: Date;

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
}
