import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
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
