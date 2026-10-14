import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let messages = ['Internal Server Error'];
    let errorName = 'Internal Server Error';

    if (isHttpException) {
      const responseData = exception.getResponse();

      if (typeof responseData === 'string') {
        messages = [responseData];
      } else if (isRecord(responseData)) {
        const message = responseData.message;
        if (Array.isArray(message)) {
          const stringMessages = message.filter(
            (item): item is string => typeof item === 'string',
          );
          if (stringMessages.length > 0) {
            messages = stringMessages;
          }
        } else if (typeof message === 'string') {
          messages = [message];
        }

        if (typeof responseData.error === 'string') {
          errorName = responseData.error;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error('Unhandled non-Error exception');
    }

    if (isHttpException) {
      this.logger.warn(`${status} - ${errorName}: ${messages.join(' | ')}`);
    }

    return response.status(status).json({
      message: messages,
      error: errorName,
      statusCode: status,
    });
  }
}