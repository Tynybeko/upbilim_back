import { PartialType } from '@nestjs/swagger';
import { CreateSelectedAnswerDto } from './create-selected-answer.dto';

export class UpdateSelectedAnswerDto extends PartialType(
  CreateSelectedAnswerDto,
) {}
