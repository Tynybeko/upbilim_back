import { TestingStatusEnum } from '../../enum/testing-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTestingDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  quiz: number;

  @ApiProperty({
    enum: TestingStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(TestingStatusEnum)
  status: TestingStatusEnum;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  owner: number;
}
