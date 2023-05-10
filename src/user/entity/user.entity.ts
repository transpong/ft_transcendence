import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,.
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  mfatoken: string;

  @Column({ nullable: true })
  mfaValidateAt: Date;
  mfa_token: string;

  @Column({ nullable: true })
  mfa_validated_at: Date;


  @Column({ nullable: true })
  status: number;

  @ManyToMany(() => UserEntity)
  @JoinTable()
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
    (directMessage) => directMessage.from_user,
  )
  directMessagesFrom: DirectMessagesEntity[];

  @OneToMany(
    () => DirectMessagesEntity,
    (directMessage) => directMessage.to_user,
  )
  directMessagesTo: DirectMessagesEntity[];

  @OneToMany(() => MatchHistoryEntity, (matchHistory) => matchHistory.user1)
  matchHistory1: MatchHistoryEntity[];

  @OneToMany(() => MatchHistoryEntity, (matchHistory) => matchHistory.user2)
  matchHistory2: MatchHistoryEntity[];

  @OneToMany(() => MatchHistoryEntity, (matchHistory) => matchHistory.winner)
  matchHistoryWinner: MatchHistoryEntity[];
}
