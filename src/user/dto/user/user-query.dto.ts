import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsString,
  IsInt,
} from 'class-validator';
import { UserRolesEnum } from '../../enums/user-roles.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../utils/dto/pagination-query.dto';

export class UserQueryDto extends PaginationQueryDto {
  @ApiProperty({
    example: UserRolesEnum.USER,
    required: false,
    enum: UserRolesEnum,
  })
  @IsOptional()
  @IsString()
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 'Orozbek Zhenishbek', required: false })
  @IsOptional()
  @IsString()
  search: string;
}
