import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKlassDto {
  @ApiProperty({ example: 'Programming' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Programming' })
  @IsNotEmpty()
  @IsString()
  title_kg: string;
}
