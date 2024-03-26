import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateUserRateDto {
  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  user: number;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  rate: number;

  @ApiProperty({ example: 100 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsNumber()
  price;

  @ApiProperty({ example: new Date() })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  validity: Date;
}
