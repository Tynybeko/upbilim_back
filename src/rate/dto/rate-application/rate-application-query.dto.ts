import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { RateAppStatusEnum } from '../../enums/rate-app-status.enum';

export class RateApplicationQueryDto extends PaginationQueryDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isAnnual: boolean;

  @ApiProperty({
    required: false,
    enum: RateAppStatusEnum,
  })
  @IsOptional()
  @IsString()
  @IsEnum(RateAppStatusEnum)
  status: RateAppStatusEnum;
}
