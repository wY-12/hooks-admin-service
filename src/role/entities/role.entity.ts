import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  perm: string[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
