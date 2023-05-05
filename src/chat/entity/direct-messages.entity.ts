import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class DirectMessagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message_text: string;

  @ManyToOne(() => UserEntity, user => user.id)
  from_user: UserEntity;

  @ManyToOne(() => UserEntity, user => user.id)
  to_user: UserEntity;
}