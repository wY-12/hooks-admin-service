import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Token, TokenParam } from '../commit/token.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: any) {
    return this.userService.login(loginDto);
  }

  @Get()
  @Token()
  findAll(@Query() query: { pageNum: number; pageSize: number }) {
    return this.userService.findAll(query.pageNum, query.pageSize);
  }

  @Get(':id')
  @Token()
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('/changePw/:id')
  @Token()
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @TokenParam() user: any,
  ) {
    return this.userService.update(+user.id, +id, updateUserDto);
  }
  @Post('/particulars/:id')
  @Token()
  updateParticulars(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @TokenParam() user: any,
  ) {
    return this.userService.updateParticulars(+user.id, +id, updateUserDto);
  }

  @Delete(':id')
  @Token()
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

}
