import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { QuizService } from '../services/quiz.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';

@Injectable({})
export class QuizOwnerGuard extends JwtAuthGuard {
  constructor(@Inject(QuizService) private readonly quizService: QuizService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const previousResult = await super.canActivate(context);
    if (!previousResult) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const quizId = +req._parsedUrl.pathname.split('/').at(-1);
    const quiz = await this.quizService.findOne(quizId);
    if (req.user.role === UserRolesEnum.MANAGER) return true;
    return (
      quiz.user?.id === req.user.sub || req.user.role === UserRolesEnum.ADMIN
    );
  }
}
