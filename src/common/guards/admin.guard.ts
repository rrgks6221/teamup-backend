import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { PermissionDeniedError } from '@module/auth/errors/permission-denied.error';

import { BaseHttpException } from '@common/base/base-http-exception';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== 'admin') {
      throw new BaseHttpException(
        HttpStatus.FORBIDDEN,
        new PermissionDeniedError(),
      );
    }

    return true;
  }
}
