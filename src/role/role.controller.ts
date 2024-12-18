import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { Token, TokenParam } from 'src/commit/token.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  
  @Get('/menu')
  @Token()
  getMenu(@TokenParam() user: any) {
    return this.roleService.getMenu(user.id);
  }

  @Get('/button')
  @Token()
  getButton(@TokenParam() user: any) {
    return this.roleService.getButton(user.id);
  }
}
