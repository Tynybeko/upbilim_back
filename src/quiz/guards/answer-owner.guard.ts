import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { QuestionService } from '../services/question.service';
import { AnswerService } from '../services/answer.service';

@Injectable({})
export class QuestionOwnerGuard extends JwtAuthGuard {
  constructor(
    @Inject(QuestionService) private readonly questionService: QuestionService,
    @Inject(AnswerService) private readonly answerService: AnswerService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const previousResult = await super.canActivate(context);
    if (!previousResult) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const answerId = +req._parsedUrl.pathname.split('/').at(-1);
    const answer = await this.answerService.findOneForGuard(answerId);
    if (
      req.user.role === UserRolesEnum.MANAGER
    ) {
      return true;
    }
    return (
      answer.question?.quiz?.user.id === req.user.sub ||
      req.user.role === UserRolesEnum.ADMIN
    );
  }
}
