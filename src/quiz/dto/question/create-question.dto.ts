import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAnswerDto } from '../answer/create-answer.dto';

export class CreateQuestionDto {
  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  quiz: number;

  @ApiProperty({ example: 'Title of question' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Just content which is not required' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  content: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
  image: MemoryStoredFile;

  @ApiProperty({ example: 30 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  time: number;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsNumber()
  point: number;

  @ApiProperty({ type: [CreateAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  order: number;
}
