import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { SelectedAnswerService } from '../services/selected-answer.service';
import { AbstractJwtAuthGuard } from './abstract-jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class SelectedAnswerGuard
  extends AbstractJwtAuthGuard
  implements CanActivate
{
  constructor(
    @Inject(SelectedAnswerService)
    private readonly selectedAnswerService: SelectedAnswerService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = this.decodeUser(
      request,
      this.jwtService,
      this.config.get<string>('ACCESS_SECRET_KEY'),
    );
    const selectedAnswerId = +request._parsedUrl.pathname.split('/').at(-1);
    const selectedAnswer = await this.selectedAnswerService.findOne(
      selectedAnswerId,
    );
    if (
      selectedAnswer.participant.user &&
      user?.sub !== selectedAnswer.participant.user.id &&
      user?.role !== UserRolesEnum.ADMIN
    ) {
      throw new ForbiddenException({
        message: 'User is not owner of this participant',
      });
    }
    return true;
  }
}
