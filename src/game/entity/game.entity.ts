import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class MatchHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user1: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user2: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  winner: UserEntity;

  @Column()
  user_1_score: number;

  @Column()
  user_2_score: number;

  @Column()
  status: number;

  @Column()
  custom: number;
}
