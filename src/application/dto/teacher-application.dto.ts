import {
    IsArray,
    IsBoolean,
    IsEnum,
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
import { UniqueValidator } from 'src/validators/unique.validator';
import { TeachApplicationEntity } from '../entities/teacher.entity';

export class CreateTeacherApplicationDto {
    @ApiProperty({ example: 'Content for application' })
    @IsString()
    @MaxLength(250)
    content: string;



    @ApiProperty({ example: 'Any contacts' })
    @IsString()
    @MaxLength(250)
    contact: string;


    @ApiProperty({ example: 'pending' })
    @IsString()
    @IsEnum(['pending', 'rejected', 'confirmed'])
    status: string;

    @IsNotEmpty()
    @ApiProperty({ example: `img` })
    @IsFile()
    @MaxFileSize(5e6)
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
    document: MemoryStoredFile;

    @ApiProperty({ example: 1 })
    @Validate(UniqueValidator, [{ table: TeachApplicationEntity, column: 'id' }], {
        message: 'Уже есть оставленная заявка!',
    })
    @Transform(({ obj, key }) => Number(obj[key]))
    @IsInt()
    user: number;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @Transform(({ obj, key }) => Number(obj[key]))
    @IsInt()
    school: number;
}




export class UpdateTeacherApplicationDto {
    @ApiProperty({ example: 'pending' })
    @IsString()
    @IsEnum(['pending', 'rejected', 'confirmed'])
    status: string;


    @ApiProperty({ example: 1 })
    @Transform(({ obj, key }) => Number(obj[key]))
    @IsInt()
    applicaion: number;
}