import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('CN') // 假设电话号码格式为中国大陆格式
  phone?: string;
}
