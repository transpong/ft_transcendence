import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UsersChannelsEntity } from './user-channels.entity';
import { ChannelMessagesEntity } from './channelmessages.entity';

@Entity()
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column()
  name: string;

  @Column()
  password_hash: string;

  @Column()
  password_salt: string;

  @Column()
  type: number;

  @OneToMany(() => UsersChannelsEntity, usersChannels => usersChannels.channel)
  users_channels: UsersChannelsEntity[];

  @OneToMany(() => ChannelMessagesEntity, channelMessage => channelMessage.channel)
  channel_messages: ChannelMessagesEntity[];
}