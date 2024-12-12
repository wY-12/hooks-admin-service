import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Particulars } from './entities/particulars.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Particulars)
    private userParticulars:  Repository<Particulars>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userVo = {
      password:createUserDto.password,
      username:createUserDto.username
    }
    const particularsVo = {
      name:createUserDto.name,
      email:createUserDto.email,
      phone:createUserDto.phone,
    }
    const userTmp = await this.usersRepository.create(userVo);
    try {
      await this.usersRepository.save(userTmp);
      const particularsTmp = this.userParticulars.create({
        ...particularsVo,
        user: userTmp, // 关联用户
      });
      await this.userParticulars.save(particularsTmp);
    } catch (error) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  findAll() {
    // const user = this.usersRepository.find({
    //   skip: 0,
    //   take: 10,
    //   select: {
    //     id: true,
    //     name: true,
    //   },
    // });
    // return user;
    return 1
  }

  findOne(id: number) {
    const user = this.usersRepository.find({
      where: { id: id },
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
