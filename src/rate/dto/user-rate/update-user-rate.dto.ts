import { PartialType } from '@nestjs/swagger';
import { CreateUserRateDto } from './create-user-rate.dto';

export class UpdateUserRateDto extends PartialType(CreateUserRateDto) {}
