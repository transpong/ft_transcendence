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

@Entity({ name: 'user_channels' })
export class UsersChannelsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_access_type' })
  userAccessType: number;

  @Column({ name: 'muted_until', nullable: true })
  mutedUntil?: Date;

  @Column({ name: 'kicked_at', nullable: true })
  kickedAt?: Date;

  @Column({ name: 'banned_at', nullable: true })
  bannedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.usersChannels)
  user: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.users_channels)
  channel: ChannelEntity;
}
