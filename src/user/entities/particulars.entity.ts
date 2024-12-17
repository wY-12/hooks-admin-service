import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Particulars {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  name: string;

  @Column()
  email: string;
  @Column()
  phone: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
