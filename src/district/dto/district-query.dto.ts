import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class DistrictQueryDto extends PaginationQueryDto {
  @ApiProperty({ required: false })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsOptional()
  @IsInt()
  region: number;

  @ApiProperty({ required: false })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsOptional()
  @IsInt()
  country: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search: string;
}
