import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserRateQueryDto extends PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  user: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  rate: number;
}
