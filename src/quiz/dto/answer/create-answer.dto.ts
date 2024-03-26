import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateAnswerDto {
  @IsOptional()
  @ApiProperty({ example: "This is a variant of question's answer" })
  @IsString()
  @MaxLength(250)
  value: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
  image: MemoryStoredFile;

  @ApiProperty({ example: false })
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isCorrect: boolean;
}
