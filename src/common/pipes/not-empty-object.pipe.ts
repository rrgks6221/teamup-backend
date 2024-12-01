import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { RequestValidationError } from '@common/base/base.error';

@Injectable()
export class NotEmptyObjectPipe implements PipeTransform {
  transform(value: unknown) {
    if (value && Object.keys(value).length === 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'request field must be at least one ',
        code: RequestValidationError.CODE,
      });
    }
    return value;
  }
}
