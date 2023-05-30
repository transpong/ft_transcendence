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
  winner?: UserEntity;

  @Column({ name: 'user_1_score', nullable: true })
  user1Score?: number;

  @Column({ name: 'user_2_score', nullable: true })
  user2Score?: number;

  @Column({ name: 'status' })
  status: number;

  @Column({ name: 'custom', nullable: true })
  custom?: number;

  @Column({ name: 'room_id' })
  roomId: string;

  @Column({ name: 'user_1_is_ready' })
  user1IsReady: boolean;

  @Column({ name: 'user_2_is_ready' })
  user2IsReady: boolean;

  readyPlayer(player: string): void {
    if (player === this.user1.ftId) {
      this.user1IsReady = true;
    } else if (player === this.user2.ftId) {
      this.user2IsReady = true;
    }
  }

  isReady(): boolean {
    return this.user1IsReady && this.user2IsReady;
  }

  setWinner(nbr: number): void {
    if (nbr === 1) {
      this.winner = this.user1;
    } else if (nbr === 2) {
      this.winner = this.user2;
    }
  }
}
