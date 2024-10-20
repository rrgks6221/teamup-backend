import { BaseError } from '@common/base/base.error';

export class ImageValidationError extends BaseError {
  static CODE: string = 'IMAGE.VALIDATION_ERROR';

  constructor(message?: string) {
    super(message ?? 'Image validation error', ImageValidationError.CODE);
  }
}
