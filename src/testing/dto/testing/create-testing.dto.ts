import { IsEnum, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TestingStatusEnum } from '../../enum/testing-status.enum';

export class CreateTestingDto {
  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  quiz: number;

  @ApiProperty({
    enum: TestingStatusEnum,
    required: false,
  })
  @IsString()
  @IsEnum(TestingStatusEnum)
  status: TestingStatusEnum;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  owner: number;
}
