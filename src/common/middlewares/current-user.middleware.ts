import { Injectable, NestMiddleware } from '@nestjs/common';

import { decode } from 'jsonwebtoken';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor() {}

  use(request: any, res: any, next: (error?: any) => void) {
    const authToken = request.headers.authorization;
    const pureToken = authToken?.replace(/^Bearer\s+/, '');
    const jwtClaims = decode(pureToken, { json: true });
    const currentUserId = jwtClaims?.sub;
    RequestContext.currentContext.req.user = {
      id: currentUserId,
    };

    next();
  }
}
