import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '../enums/user-roles.enum';
import { TeacherService } from '../services/teacher.service';

@Injectable({})
export class IsTeacherGuard extends JwtAuthGuard {
  constructor(
    @Inject(TeacherService) private readonly teacherService: TeacherService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const previousResult = await super.canActivate(context);
    if (!previousResult) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const teacherId = +req._parsedUrl.pathname.split('/').at(-1);
    const teacher = await this.teacherService.findOne(teacherId);
    return (
      teacher.user.id === req.user.id || req.user.role === UserRolesEnum.ADMIN
    );
  }
}
