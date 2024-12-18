import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export const TOKEN_METADATA_KEY = 'token';
export const Token = () => SetMetadata(TOKEN_METADATA_KEY, true);

export const TokenParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const jwtService = new JwtService({
      secret: new ConfigService().get('JWT_SECRET'),
    });

    try {
      const payload = jwtService.verify(token);
      request[TOKEN_METADATA_KEY] = payload; // 存储解析后的用户信息
      return payload; // 返回解析后的用户信息
    } catch (error) {
      throw new Error('Invalid token');
    }
  },
);
