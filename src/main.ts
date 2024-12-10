import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './filters/validation.filter';
import * as compression from 'compression';
import { ResponseInterceptor } from './filters/transform.interceptor';

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
