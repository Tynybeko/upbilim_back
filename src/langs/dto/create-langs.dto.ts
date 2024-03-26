import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { UniqueValidator } from 'src/validators/unique.validator';
import { LangEntity } from '../entities/langs.entity';

export class CreateLangDto {
  @ApiProperty({ example: 1 })
  @Validate(UniqueValidator, [{ table: LangEntity, column: 'id' }], {
    message: 'Язык с таким id уже существует!',
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Русский' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ example: 'Орусча' })
  @IsNotEmpty()
  @IsString()
  label_kg: string;

  @ApiProperty({ example: `Орусча` })
  @IsNotEmpty()
  @IsString()
  label_kz: string;

  @ApiProperty({ example: `O'rizcha` })
  @IsNotEmpty()
  @IsString()
  label_uz: string;

  @ApiProperty({ example: 'Russian' })
  @IsNotEmpty()
  @IsString()
  label_en: string;
}
