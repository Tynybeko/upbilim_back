import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParticipantService } from '../services/participant.service';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AbstractJwtAuthGuard } from './abstract-jwt-auth.guard';

export class ParticipantGuard
  extends AbstractJwtAuthGuard
  implements CanActivate
{
  constructor(
    @Inject(ParticipantService)
    private readonly participantService: ParticipantService,
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
    const participantId = +request._parsedUrl.pathname.split('/').at(-1);
    const participant = await this.participantService.findOne(participantId);
    if (
      participant.user &&
      user?.sub !== participant.user.id &&
      user?.role !== UserRolesEnum.ADMIN
    ) {
      throw new ForbiddenException({
        message: 'User is not owner of this participant',
      });
    }
    return true;
  }
}
