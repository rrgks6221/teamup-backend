import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { ValidationError } from 'class-validator';

import { AppModule } from 'src/app.module';

import { BaseHttpExceptionFilter } from '@common/base/base-http-exception.filter';
import { RequestValidationError } from '@common/base/base.error';

import { LOGGER } from '@shared/logger/logger.module';

export const createApp = async () => {
  return await NestFactory.create(AppModule, { bufferLogs: true });
};

export const setGlobalPipe = (app: INestApplication) => {
  const options: Omit<ValidationPipeOptions, 'exceptionFactory'> = {
    transform: true,
    whitelist: true,
  };

  const exceptionFactory = (validationErrors: ValidationError[]) => {
    const errors = validationErrors.map((validationError) => {
      return {
        property: validationError.property,
        constraints: Object.values(validationError.constraints ?? {}),
      };
    });

    throw new BadRequestException({
      statusCode: 400,
      message: 'request input validation error',
      code: RequestValidationError.CODE,
      errors,
    });
  };

  app.useGlobalPipes(new ValidationPipe({ ...options, exceptionFactory }));
};

export const setLogger = (app: INestApplication) => {
  app.useLogger(app.get(LOGGER));
};

export const setGlobalInterceptor = (app: INestApplication) => {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
};

export const setGlobalExceptionFilter = (app: INestApplication) => {
  app.useGlobalFilters(new BaseHttpExceptionFilter());
};
