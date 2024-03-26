import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateParticipantDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  user: number;

  @ApiProperty({ example: 'oroz' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Transform(({ obj, key }) => Number(obj[key]))
  testing: number;
}
