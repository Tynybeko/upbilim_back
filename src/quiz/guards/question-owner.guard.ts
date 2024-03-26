import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { QuestionService } from '../services/question.service';

@Injectable({})
export class QuestionOwnerGuard extends JwtAuthGuard {
  constructor(
    @Inject(QuestionService) private readonly questionService: QuestionService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const previousResult = await super.canActivate(context);
    if (!previousResult) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const questionId = +req._parsedUrl.pathname.split('/').at(-1);
    const question = await this.questionService.findOne(questionId);
    if (req.user.role === UserRolesEnum.MANAGER) {
      return true;
    }
    return (
      question?.quiz?.user.id === req.user.sub ||
      req.user.role === UserRolesEnum.ADMIN
    );
  }
}
