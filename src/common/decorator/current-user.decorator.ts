import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { decode } from 'jsonwebtoken';

export interface ICurrentUser {
  id: string;
}

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const pureToken = request.headers.authorization.replace(/^Bearer\s/, '');

    const jwtClaims = decode(pureToken, { json: true });

    return {
      id: jwtClaims?.sub,
    };
  },
);
