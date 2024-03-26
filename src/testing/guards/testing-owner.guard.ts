import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { TestingService } from '../services/testing.service';

@Injectable({})
export class TestingOwnerGuard extends JwtAuthGuard {
  constructor(
    @Inject(TestingService) private readonly testingService: TestingService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const previousResult = await super.canActivate(context);
    if (!previousResult) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const testingId = +req._parsedUrl.pathname.split('/').at(-1);
    const testing = await this.testingService.findOne(testingId);
    return (
      testing.owner.id === req.user.id || req.user.role === UserRolesEnum.ADMIN
    );
  }
}
