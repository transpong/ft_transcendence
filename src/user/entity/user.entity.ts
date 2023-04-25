import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToMany(() => UserEntity)
  friendId: number;

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
