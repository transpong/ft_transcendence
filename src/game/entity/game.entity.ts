import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId1: number;

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
