import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class KlassQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'search', required: false })
  @IsOptional()
  @IsString()
  search: string;

  // @ApiProperty({ example: 1, required: false })
  // @IsOptional()
  // @Transform(({ obj, key }) => Number(obj[key]))
  // @IsInt()
  // school: number;
}
