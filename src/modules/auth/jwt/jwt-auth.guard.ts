import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { UnauthorizedUserError } from '@module/auth/errors/unauthorized-user.error';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';
import { BaseHttpException } from '@common/base/base-http-exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new BaseHttpException(
        HttpStatus.UNAUTHORIZED,
        new UnauthorizedUserError(),
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.appConfigService.get<string>(ENV_KEY.JWT_SECRET_KEY),
        issuer: this.appConfigService.get<string>(ENV_KEY.JWT_ISSUER),
        audience: this.appConfigService
          .get<string>(ENV_KEY.JWT_AUDIENCES)
          .split(','),
      });

      request['user'] = {
        id: payload.sub,
      };
    } catch {
      throw new BaseHttpException(
        HttpStatus.UNAUTHORIZED,
        new UnauthorizedUserError(),
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
