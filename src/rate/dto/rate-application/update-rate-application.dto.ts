import { ApiProperty } from '@nestjs/swagger';
import { RateAppStatusEnum } from '../../enums/rate-app-status.enum';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRateApplicationDto {
  @ApiProperty({ example: true })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isAnnual: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  duration: number;

  @ApiProperty({ example: '+996776780472' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber(undefined)
  phone: string;

  @ApiProperty({ example: RateAppStatusEnum.PENDING, enum: RateAppStatusEnum })
  @IsOptional()
  @IsString()
  @IsEnum(RateAppStatusEnum)
  status: RateAppStatusEnum;
}
