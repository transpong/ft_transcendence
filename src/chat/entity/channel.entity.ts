import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { UsersChannelsEntity } from './user-channels.entity';
import { ChannelMessagesEntity } from './channelmessages.entity';

@Entity()
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: number;

  @ManyToMany(() => UserEntity, user => user.channels)
  users: UserEntity[];

  @OneToMany(() => UsersChannelsEntity, usersChannels => usersChannels.channel)
  usersChannels: UsersChannelsEntity[];

  @OneToMany(() => ChannelMessagesEntity, channelMessage => channelMessage.channel)
  channelMessages: ChannelMessagesEntity[];
}