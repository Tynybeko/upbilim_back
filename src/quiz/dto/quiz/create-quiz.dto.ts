import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { UniqueValidator } from 'src/validators/unique.validator';
import { LangEntity } from 'src/langs/entities/langs.entity';

export class CreateQuizDto {
  @ApiProperty({ example: 'Title of quiz' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Description of quiz' })
  @IsString()
  @MaxLength(250)
  description: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
  image: MemoryStoredFile;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
  icon: MemoryStoredFile;


  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  subject: number;


  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  lang: number;


  // @ApiProperty({ type: [CreateQuestionDto] })
  // @IsNotEmpty()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateQuestionDto)
  // questions: CreateQuestionDto[];

  @ApiProperty({ example: 30 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  time: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  user: number;

  @ApiProperty({ example: false })
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isORT: boolean;

  @ApiProperty({ example: false })
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isPublished: boolean;
}
