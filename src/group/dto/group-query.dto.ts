import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';

export class GroupQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'search', required: false })
  @IsOptional()
  @IsString()
  search: string;

}
