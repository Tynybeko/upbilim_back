import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';

export class AbstractJwtAuthGuard {
  decodeUser(req: any, jwtService: JwtService, secret: string) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        throw new ForbiddenException({
          message: 'The user is not authenticated',
        });
      }
      try {
        return jwtService.verify(token, { secret });
      } catch (err) {
        return null;
      }
    } else return null;
  }
}
