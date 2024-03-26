import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PostQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  author: number;

  @ApiProperty({ example: 'search of post', required: false })
  @IsOptional()
  @IsString()
  search: string;
}
