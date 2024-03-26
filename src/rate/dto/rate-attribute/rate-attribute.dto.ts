import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RateAttributeDto {
  @ApiProperty({ example: 'Включено все' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Включено все' })
  @IsString()
  title_kg: string;
}
