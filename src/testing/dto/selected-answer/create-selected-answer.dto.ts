import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSelectedAnswerDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  participant: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  question: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  answer: number;

  @ApiProperty({ example: 6 })
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  point: number;
}
