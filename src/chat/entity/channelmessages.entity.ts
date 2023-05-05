import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { ChannelEntity } from './channel.entity';

@Entity()
export class ChannelMessagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message_text: string;

  @ManyToOne(() => UserEntity, user => user.id)
  user: UserEntity;

  @ManyToOne(() => ChannelEntity, channel => channel.channelMessages)
  channel: ChannelEntity;
}