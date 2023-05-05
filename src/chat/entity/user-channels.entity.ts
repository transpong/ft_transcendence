import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { ChannelEntity } from './channel.entity';

@Entity()
export class UsersChannelsEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => ChannelEntity, (channel) => channel.usersChannels)
  channel: ChannelEntity;
}
