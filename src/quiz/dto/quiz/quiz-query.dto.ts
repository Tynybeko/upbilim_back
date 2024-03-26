import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';

export class QuizQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'oroz', required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  subject: number;


  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  lang: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  group: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  user: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isORT: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isFrozen: boolean;
}
