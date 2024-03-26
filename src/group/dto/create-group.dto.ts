import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { UniqueValidator } from 'src/validators/unique.validator';
import { CountryEntity } from 'src/country/entities/country.entity';

export class CreateGroupDto {
  @ApiProperty({ example: 1 })
  @Validate(UniqueValidator, [{ table: CountryEntity, column: 'id' }], {
    message: 'Группа с таким id уже существует!',
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Учеба' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ example: 'Окуу' })
  @IsNotEmpty()
  @IsString()
  label_kg: string;

  @ApiProperty({ example: 'Окуу' })
  @IsNotEmpty()
  @IsString()
  label_kz: string;

  @ApiProperty({ example: `O'qish` })
  @IsNotEmpty()
  @IsString()
  label_uz: string;

  @ApiProperty({ example: 'Education' })
  @IsNotEmpty()
  @IsString()
  label_en: string;
}
