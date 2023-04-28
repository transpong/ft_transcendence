import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity, (user) => user.matchHistory, { eager: true })
  @JoinTable()
  users: UserEntity[];

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
