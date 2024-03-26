import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty({ example: 'Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Content' })
  @IsString()
  @MaxLength(2200)
  content: string;

  @ApiProperty({ example: 'Link' })
  @IsString()
  link: string;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  district: number;
}
