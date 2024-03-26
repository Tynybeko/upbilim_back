import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ example: 20, required: false })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  @IsOptional()
  limit: number;

  @ApiProperty({ example: 1, required: false })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  @IsOptional()
  offset: number;
}
