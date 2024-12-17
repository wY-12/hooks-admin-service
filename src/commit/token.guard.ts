// src/token.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { TOKEN_METADATA_KEY } from './token.decorator';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiresToken = this.reflector.getAllAndOverride<boolean>(TOKEN_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || !requiresToken) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new HttpException('服务出现了错误', HttpStatus.UNAUTHORIZED);
    }

    try {
      const secretKey = this.configService.get('JWT_SECRET');
      const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
      request.user = decoded;
    } catch (err) {
      console.log(err);
      throw new HttpException('Invalid JWT token', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}