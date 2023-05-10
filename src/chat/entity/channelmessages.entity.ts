import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { ChannelEntity } from './channel.entity';

@Entity()
export class ChannelMessagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  message_text: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.channel_messages)
  channel: ChannelEntity;
}
