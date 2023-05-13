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

@Entity()
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'password_salt' })
  passwordSalt: string;

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
}
