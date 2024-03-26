import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';

export class ParticipantQueryDto extends PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  user: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  testing: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  subject: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  klass: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  group: number;
}
