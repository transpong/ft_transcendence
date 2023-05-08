import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class BlockUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => UserEntity, user => user.id)
  user_id_1: UserEntity;

  @ManyToOne(() => UserEntity, user => user.id)
  user_id_2: UserEntity;
}
