import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreatePostImageDto {
  @ApiProperty({ example: 'Title of the post' })
  @IsString()
  title: string;

  @ApiProperty({ example: null })
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
  image: MemoryStoredFile;
}
