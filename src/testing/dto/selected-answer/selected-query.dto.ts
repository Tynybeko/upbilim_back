import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';

export class SelectedQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  participant: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  question: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  answer: number;
}
