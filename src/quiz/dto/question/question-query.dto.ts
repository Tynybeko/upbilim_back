import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  quiz: number;

  @ApiProperty({ example: 'order', required: false })
  @IsOptional()
  @IsString()
  orderBy: string;

  @ApiProperty({ example: 'DESC', required: false })
  @IsOptional()
  @IsString()
  order: 'DESC' | 'ASC';

  @ApiProperty({ example: 'oroz', required: false })
  @IsOptional()
  @IsString()
  search: string;
}
