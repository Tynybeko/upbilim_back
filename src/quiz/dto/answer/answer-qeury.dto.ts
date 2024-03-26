import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AnswerQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'oroz', required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  question: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isCorrect: boolean;
}
