import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
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

  @Column({ nullable: true })
  nickname: string;

  @Column()
  avatar: string;

  @Column({ nullable: true })
  mfatoken: string;

  @Column({ nullable: true })
  mfaValidateAt: Date;

  @Column({ nullable: true })
  status: number;

  @Column()
  ftId: string;
}
