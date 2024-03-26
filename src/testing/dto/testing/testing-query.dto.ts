import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TestingStatusEnum } from '../../enum/testing-status.enum';

export class TestingQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'oroz', required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  quiz: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  owner: number;

  @ApiProperty({
    enum: TestingStatusEnum,
    required: false,
    example: TestingStatusEnum.CREATED,
  })
  @IsOptional()
  @IsString()
  @IsEnum(TestingStatusEnum)
  status: TestingStatusEnum;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  participant: number;
}
