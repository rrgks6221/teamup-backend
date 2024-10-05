import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

import { RequestValidationError } from '@common/base/base.error';

export class ParsePositiveIntStringPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): string {
    const { type, data } = metadata;
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
      throw new BadRequestException({
        statusCode: 400,
        message: `request ${type} ${data} must be a positive integer string`,
        code: RequestValidationError.CODE,
      });
    }

    return value;
  }
}
