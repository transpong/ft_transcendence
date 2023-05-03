import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('temp')
export class TempEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  email: string;
}
