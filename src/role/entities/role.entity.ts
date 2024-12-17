import { Particulars } from 'src/user/entities/particulars.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  perm: string[];

  @OneToMany(() => Particulars, (particulars) => particulars.role)
  particulars: Particulars[];
}
