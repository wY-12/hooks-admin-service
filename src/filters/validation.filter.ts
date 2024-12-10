import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let message: string | string[];
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (response instanceof Array) {
        const validationErrors = response as ValidationError[];
        message = this.formatValidationErrors(validationErrors).join(', ');
      } else {
        message = Array.isArray(response['message'])
          ? response['message'].join(',')
          : response.toString();
      }
    }

    response.status(status).json({
      statusCode: -1,
      message: message,
    });
  }

  private formatValidationErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((error) => {
      if (error.constraints) {
        return Object.values(error.constraints);
      }
      if (error.children && error.children.length > 0) {
        return this.formatValidationErrors(error.children);
      }
      return [];
    });
  }
}
