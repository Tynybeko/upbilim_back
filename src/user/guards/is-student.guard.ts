import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '../enums/user-roles.enum';
import { StudentService } from '../services/student.service';

@Injectable({})
export class IsStudentGuard extends JwtAuthGuard {
  constructor(
    @Inject(StudentService) private readonly studentService: StudentService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const previousResult = await super.canActivate(context);
    if (!previousResult) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const studentId = +req._parsedUrl.pathname.split('/').at(-1);
    const student = await this.studentService.findOne(studentId);
    return (
      student.user.id === req.user.id || req.user.role === UserRolesEnum.ADMIN
    );
  }
}
