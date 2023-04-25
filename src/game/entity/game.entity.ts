import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => GameEntity)
  @Column()
  userId1: number;

  @OneToOne(() => GameEntity)
  @Column()
  userId2: number;

  @Column()
  winnerId: number;

  @Column()
  user1Score: number;

  @Column()
  user2Score: number;

  @Column()
  status: number;

  @Column()
  mapId: number;
}
