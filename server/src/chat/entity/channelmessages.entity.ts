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

@Entity({ name: 'channel_messages' })
export class ChannelMessagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'message_text' })
  messageText: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.channel_messages, {
    onDelete: 'CASCADE',
  })
  channel: ChannelEntity;
}
