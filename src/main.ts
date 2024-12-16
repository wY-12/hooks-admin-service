import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './filters/validation.filter';
import * as compression from 'compression';
import { ResponseInterceptor } from './filters/transform.interceptor';
import * as fs from 'fs';
import * as path from 'path';
import * as spdy from 'spdy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(compression());

  // 创建 HTTPS 服务器配置
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'cert.pem')),
  };

  // 使用 spdy 创建 HTTP/2 服务器
  const server = spdy.createServer(httpsOptions, app.getHttpAdapter().getInstance());

  // 监听端口
  server.listen(process.env.PORT ?? 3000, () => {
    console.log(`NestJS application is running on https://localhost:${process.env.PORT ?? 3000}`);
  });
}

bootstrap();