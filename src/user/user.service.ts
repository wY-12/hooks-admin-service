import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { getConnection, Repository } from 'typeorm';
import { Particulars } from './entities/particulars.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Particulars)
    private userParticulars: Repository<Particulars>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, username, name, email, phone } = createUserDto;

    try {
      // 创建 User 实体，并关联 Particulars
      const user = this.usersRepository.create({
        password,
        username,
      });

      // 保存 User 实体
      await this.usersRepository.save(user);
      // 创建 Particulars 实体
      const particulars = this.userParticulars.create({
        name,
        email,
        phone,
        user: user,
      });

      // 保存更新后的 Particulars 实体
      await this.userParticulars.save(particulars);
    } catch (error) {
      if (error.sqlState === '23000') {
        throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST, {
          cause: error,
        });
      }
      throw new HttpException(
        '创建用户失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async findAll(pageNum: number, pageSize: number): Promise<User[]> {
    const skip = (pageNum - 1) * pageSize;
    const users = await this.usersRepository.find({
      skip: Math.max(skip, 0), // 确保 skip 不为负数
      take: pageSize,
      relations: ['particulars'],
      select: {
        id: true,
        username: true,
        particulars: {
          name: true,
          email: true,
          phone: true,
        },
      },
    });

    return users;
  }
  findOne(id: number) {
    const user = this.usersRepository.findOne({
      where: { id: id },
      relations: ['particulars'],
      select: {
        id: true,
        username: true,
        particulars: {
          name: true,
          email: true,
          phone: true,
        },
      },
    });
    return user;
  }

  async update(userId: number, id: number, updateUserDto: UpdateUserDto) {
    if (id !== userId) {
      throw new HttpException('用户ID不匹配', HttpStatus.BAD_REQUEST);
    }
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    const userPo = {
      username: updateUserDto.username,
      password: updateUserDto.password,
    };
    const newUser = this.usersRepository.merge(user, userPo);
    await this.usersRepository.save(newUser);
    // await this.updateParticulars(user, updateUserDto);
    return '更新成功';
  }

  async updateParticulars(user, particularsDto: UpdateUserDto) {
    const particularsPo = {
      name: particularsDto.name,
      email: particularsDto.email,
      phone: particularsDto.phone,
    };
    const newParticulars = this.userParticulars.merge(
      user.particulars,
      particularsPo,
    );
    await this.userParticulars.save(newParticulars);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['particulars'],
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    try {
      // 删除用户详细信息
      if (user.particulars) {
        await this.userParticulars.remove(user.particulars);
      }

      // 删除用户
      await this.usersRepository.remove(user);
      return '删除成功';
    } catch {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
