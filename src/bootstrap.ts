import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ValidationError } from 'class-validator';

import { AppModule } from 'src/app.module';

import { BaseHttpExceptionFilter } from '@common/base/base-http-exception.filter';
import { RequestValidationError } from '@common/base/base.error';

export const createApp = async () => {
  return await NestFactory.create(AppModule);
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

export const setGlobalInterceptor = (app: INestApplication) => {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
};

export const setGlobalExceptionFilter = (app: INestApplication) => {
  app.useGlobalFilters(new BaseHttpExceptionFilter());
};

export const setSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('era-meet')
    .setDescription('The era-meet API description')
    .setVersion('0.1')
    .addTag('era-meet')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: (a: Map<string, string>, b: Map<string, string>) => {
        const order = {
          post: '0',
          get: '1',
          put: '2',
          patch: '3',
          delete: '4',
        };

        return order[a.get('method') as string].localeCompare(
          order[b.get('method') as string],
        );
      },
    },
  });
};
