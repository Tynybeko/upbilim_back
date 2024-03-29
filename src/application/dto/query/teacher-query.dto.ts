

import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';



export class TeacherQueryDto extends PaginationQueryDto {
    @ApiProperty({ enumName: 'role', enum: ['pending', 'rejected', 'confirmed'], required: false })
    @IsOptional()
    @IsString()
    @IsEnum(['pending', 'rejected', 'confirmed'])
    status: string;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @Transform(({ obj, key }) => Number(obj[key]))
    @IsInt()
    user: number;


    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @Transform(({ obj, key }) => Number(obj[key]))
    @IsInt()
    school: number;

}
