import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userTmp = await this.usersRepository.create(createUserDto);
    try {
      await this.usersRepository.save(userTmp);
    } catch (error) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  findAll() {
    const user = this.usersRepository.find({
      skip: 0,
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    });
    return user;
  }

  findOne(name: string) {
    const user = this.usersRepository.find({
      where: { name: name },
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
