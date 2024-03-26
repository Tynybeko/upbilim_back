import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsPhoneNumber, IsString } from 'class-validator';

export class CreateRateApplicationDto {
  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  rate: number;

  @ApiProperty({ example: true })
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isAnnual: boolean;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  duration: number;

  @ApiProperty({ example: '+996776780472' })
  @IsString()
  @IsPhoneNumber(undefined)
  phone: string;
}
