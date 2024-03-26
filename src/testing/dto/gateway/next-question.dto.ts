import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class NextQuestionDto {
  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  question: number;
}
