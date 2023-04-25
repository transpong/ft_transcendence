import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameEntity } from '../../game/entity/game.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToMany(() => UserEntity)
  friendId: number;

  @OneToMany(() => GameEntity, (game: GameEntity) => game.userId1)
  matchHistory: GameEntity[];

  @Column()
  nickname: string;

  @Column()
  avatar: string;

  @Column()
  mfatoken: string;

  @Column()
  mfaValidateAt: Date;

  @Column()
  status: number;

  @Column()
  ftId: string;
}
