import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles-auth.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RoleAuthGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<any> {
    const previousResult = await super.canActivate(context);
    return true
    if (!previousResult) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const userRole = req.user.role;

    return requiredRoles.includes(userRole);
  }
}
