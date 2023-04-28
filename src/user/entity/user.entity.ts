import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { GameEntity } from '../../game/entity/game.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  friends: UserEntity[];

  @ManyToMany(() => GameEntity, (game: GameEntity) => game.users)
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
