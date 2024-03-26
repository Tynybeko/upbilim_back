import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreatePostDto {
  @ApiProperty({ example: 'Title of the post' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Just a small description' })
  @IsString()
  description: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
  image: MemoryStoredFile;

  @ApiProperty({ example: 'Full content' })
  @IsString()
  content: string;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  author: number;
}
