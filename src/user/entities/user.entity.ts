import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from 'typeorm';
import { Particulars } from './particulars.entity';
import { Role } from 'src/role/entities/role.entity';

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

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;

  constructor(role?: Role) {
    if (!role) {
      this.role = new Role();
      this.role.id = 2; // 设置默认角色ID
    } else {
      this.role = role;
    }
  }
}
