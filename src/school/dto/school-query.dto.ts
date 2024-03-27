import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SchoolQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'Title', required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  district: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  region: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  country: number;

}
