import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { ChannelEntity } from './channel.entity';

@Entity()
export class UsersChannelsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column()
  user_access_type: number;

  @Column({ nullable: true })
  muted_until: Date;

  @Column({ nullable: true })
  kicked_at: Date;

  @Column({ nullable: true })
  banned_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.usersChannels)
  user: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.users_channels)
  channel: ChannelEntity;
}
