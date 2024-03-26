import { RateAttributeEntity } from '../../entities/rate-attribute.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateRateDto {
  @ApiProperty({ example: 'Title of quiz' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Title of quiz' })
  @IsString()
  title_kg: string;

  @ApiProperty({ example: 'Description' })
  @IsString()
  @MaxLength(200)
  description: string;

  @ApiProperty({ example: 'Description' })
  @IsString()
  @MaxLength(200)
  description_kg: string;

  @ApiProperty({ example: 'Description' })
  @IsString()
  @MaxLength(200)
  content: string;

  @ApiProperty({ example: 'Description' })
  @IsString()
  @MaxLength(200)
  content_kg: string;

  @ApiProperty({ example: [1, 2] })
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  attributes: RateAttributeEntity[];

  @ApiProperty({ example: 30 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsNumber()
  annualPrice: number;

  @ApiProperty({ example: 30 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsNumber()
  monthlyPrice: number;

  @ApiProperty({ example: 30 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  amountOfPublicTests: number;

  @ApiProperty({ example: 30 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  amountOfHiddenTests: number;

  @ApiProperty({ example: [1, 2] })
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  subjects: number[];

  @ApiProperty({ example: 30 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  amountOfParticipants: number;

  @ApiProperty({ example: 30 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  amountOfQuestions: number;

  @ApiProperty({ example: true })
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ example: true })
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isFreemium: boolean;
}
