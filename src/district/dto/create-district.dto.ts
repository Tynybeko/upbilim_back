import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { UniqueValidator } from 'src/validators/unique.validator';
import { DistrictEntity } from '../entities/district.entity';

export class CreateDistrictDto {
  @ApiProperty({ example: 1 })
  @Validate(UniqueValidator, [{ table: DistrictEntity, column: 'id' }], {
    message: 'Район с таким id уже существует!',
  })
  @IsNotEmpty()
  @IsInt()
  id: number;



  @ApiProperty({ example: 'Ленинский район' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ example: 'Ленин району' })
  @IsNotEmpty()
  @IsString()
  label_kg: string;

  @ApiProperty({ example: 'Ленин району' })
  @IsNotEmpty()
  @IsString()
  label_kz: string;

  @ApiProperty({ example: 'Lenin tumani' })
  @IsNotEmpty()
  @IsString()
  label_uz: string;

  @ApiProperty({ example: 'Leninsky district' })
  @IsNotEmpty()
  @IsString()
  label_en: string;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  region: number;


  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  country: number;
}
