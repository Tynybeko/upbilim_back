import { IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueValidator } from 'src/validators/unique.validator';
import { Transform } from 'class-transformer';
import { SubjectEntity } from '../entities/subject.entity';

export class CreateSubjectDto {
  @ApiProperty({ example: 1 })
  @Validate(UniqueValidator, [{ table: SubjectEntity, column: 'id' }], {
    message: 'Предмет с таким id уже существует!',
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Математика' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ example: 'Математика' })
  @IsNotEmpty()
  @IsString()
  label_kg: string;

  @ApiProperty({ example: 'Математика' })
  @IsNotEmpty()
  @IsString()
  label_kz: string;

  @ApiProperty({ example: `Matematika` })
  @IsNotEmpty()
  @IsString()
  label_uz: string;

  @ApiProperty({ example: 'Math' })
  @IsNotEmpty()
  @IsString()
  label_en: string;

  @ApiProperty({ example: 1 })
  @Transform(({ obj, key }) => Number(obj[key]))
  @IsInt()
  group: number;
}
