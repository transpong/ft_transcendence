import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ChannelEntity } from '../../chat/entity/channel.entity';
import { UsersChannelsEntity } from '../../chat/entity/user-channels.entity';
import { DirectMessagesEntity } from '../../chat/entity/direct-messages.entity';
import { MatchHistoryEntity } from '../../game/entity/game.entity';


@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  mfa_token: string;

  @Column({ nullable: true })
  mfa_validated_at: Date;

  @Column()
  status: number;

  @ManyToMany(() => ChannelEntity, channel => channel.users, { cascade: true })
  @JoinTable({
    name: 'users_channels',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'channel_id', referencedColumnName: 'id' },
  })
  channels: ChannelEntity[];

  @OneToMany(() => UsersChannelsEntity, usersChannels => usersChannels.user)
  usersChannels: UsersChannelsEntity[];

  @OneToMany(() => DirectMessagesEntity, directMessage => directMessage.from_user)
  directMessagesFrom: DirectMessagesEntity[];

  @OneToMany(() => DirectMessagesEntity, directMessage => directMessage.to_user)
  directMessagesTo: DirectMessagesEntity[];

  @OneToMany(() => MatchHistoryEntity, matchHistory => matchHistory.user1)
  matchHistory1: MatchHistoryEntity[];

  @OneToMany(() => MatchHistoryEntity, matchHistory => matchHistory.user2)
  matchHistory2: MatchHistoryEntity[];

  @OneToMany(() => MatchHistoryEntity, matchHistory => matchHistory.winner)
  matchHistoryWinner: MatchHistoryEntity[];
}