import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'match_history' })
export class MatchHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user1: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user2: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  winner: UserEntity;

  @Column({ name: 'user_1_score' })
  user1Score: number;

  @Column({ name: 'user_2_score' })
  user2Score: number;

  @Column({ name: 'status' })
  status: number;

  @Column({ name: 'custom' })
  custom: number;
}
