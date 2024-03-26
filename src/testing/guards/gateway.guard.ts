import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ParticipantService } from '../services/participant.service';

interface ModifiedHeaders extends Headers {
  participantKey: string;
}

interface IGatewayGuardRequest extends Request {
  headers: ModifiedHeaders;
}

@Injectable()
export class GatewayGuard implements CanActivate {
  constructor(private participantService: ParticipantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IGatewayGuardRequest = context.switchToHttp().getRequest();
    if (request.headers.participantKey) {
      const participant = await this.participantService.findByAccessKey(
        request.headers.participantKey,
      );
      return !!participant;
    } else {
      throw new BadRequestException({
        message: 'participantKey is important in headers',
      });
    }
  }
}
