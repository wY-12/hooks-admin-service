import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  menu: string[];

  @Column('json')
  button: object;

  @OneToMany(() => User, (user) => user.role)
  User: User[];
}
