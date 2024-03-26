import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { UniqueValidator } from 'src/validators/unique.validator';
import { CountryEntity } from '../entities/country.entity';

export class CreateCountryDto {
  @ApiProperty({ example: 1 })
  @Validate(UniqueValidator, [{ table: CountryEntity, column: 'id' }], {
    message: 'Страна с таким id уже существует!',
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Киргизия' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ example: 'Кыргызстан' })
  @IsNotEmpty()
  @IsString()
  label_kg: string;

  @ApiProperty({ example: 'Кыргызстан' })
  @IsNotEmpty()
  @IsString()
  label_kz: string;

  @ApiProperty({ example: `Qirg'iziston` })
  @IsNotEmpty()
  @IsString()
  label_uz: string;

  @ApiProperty({ example: 'Kyrgyzstan' })
  @IsNotEmpty()
  @IsString()
  label_en: string;
}
