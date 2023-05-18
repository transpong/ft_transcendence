import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'direct_messages' })
export class DirectMessagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'message_text' })
  messageText: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  fromUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  toUser: UserEntity;
}
