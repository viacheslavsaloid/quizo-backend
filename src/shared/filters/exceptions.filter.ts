import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DebugLogger } from '../helpers';
import * as path from 'path';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    DebugLogger(this, request.url, exception);

    if (exception instanceof NotFoundException) {
      response.sendFile(path.join(__dirname, '../../../dist/index.html'));
    }
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json({
      statusCode,
      message: exception.response,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
