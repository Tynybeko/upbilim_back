import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  user: number;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  group: number;
}
