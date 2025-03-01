import { BaseError } from '@common/base/base.error';

export class ProjectApplicationCreationRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.APPLICATION_CREATION_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the creation of project application',
      ProjectApplicationCreationRestrictedError.CODE,
    );
  }
}
