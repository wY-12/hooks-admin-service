import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Particulars } from './particulars.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @OneToOne(() => Particulars, (particulars) => particulars.user)
  particulars: Particulars;
}
