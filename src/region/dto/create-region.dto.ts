import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { UniqueValidator } from 'src/validators/unique.validator';
import { RegionEntity } from '../entities/region.entity';

export class CreateRegionDto {
  @ApiProperty({ example: 1 })
  @Validate(UniqueValidator, [{ table: RegionEntity, column: 'id' }], {
    message: 'Регион с таким id уже существует!',
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Чуйская область' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ example: 'Чуй обласы' })
  @IsNotEmpty()
  @IsString()
  label_kg: string;

  @ApiProperty({ example: 'Чуй обласы' })
  @IsNotEmpty()
  @IsString()
  label_kz: string;

  @ApiProperty({ example: 'Chuy viloyati' })
  @IsNotEmpty()
  @IsString()
  label_uz: string;

  @ApiProperty({ example: 'Chui area' })
  @IsNotEmpty()
  @IsString()
  label_en: string;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  country: number;
}
