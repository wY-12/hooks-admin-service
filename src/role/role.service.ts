import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
    @InjectRepository(Role)
    private usersRole: Repository<Role>,
    private readonly JwtService: JwtService,
  ) {}
  async getMenu(id) {
    try {
      const menu = await this.users.findOne({
        where: {
          id: id,
        },
        relations: ['role'],
        select: {
          role: {
            menu: true,
          },
        },
      });
      const permArray = menu.role.menu.map(role => role).flat();
      return permArray;
    } catch (error) {
      return '获取失败';
    }
  }

  async getButton(id) {
    try {
      const button = await this.users.findOne({
        where: {
          id: id,
        },
        relations: ['role'],
      });
      return button.role.button;
    } catch (error) {
      return '获取失败';
    }
  }
}
