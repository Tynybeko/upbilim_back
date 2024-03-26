import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UpdateQuestionDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  quiz: number;

  @ApiProperty({ example: 'Title of question' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Just content which is not required' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  content: string;

  @ApiProperty({ example: 30 })
  @IsOptional()
  @IsInt()
  time: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  point: number;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
  image: MemoryStoredFile;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  order: number;
}
