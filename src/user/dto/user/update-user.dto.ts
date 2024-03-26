import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRolesEnum } from '../../enums/user-roles.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'user' })
  @IsOptional()
  @IsString()
  // @Validate(UniqueValidator, [{ table: UserEntity, column: 'username' }], {
  //   message: 'Такое имя пользователя уже занято',
  // })
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: '********' })
  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @ApiProperty({ example: '+996776780472' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  // @Validate(UniqueValidator, [{ table: UserEntity, column: 'phone' }], {
  //   message: 'Пользователь с таким номером телефона уже существует',
  // })
  phone: string;

  @ApiProperty({ example: 'oroz@gmail.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  // @Validate(UniqueValidator, [{ table: UserEntity, column: 'email' }], {
  //   message: 'Пользователь с таким электронной почтой уже существует',
  // })
  email: string;

  @ApiProperty({ example: 'oroz' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'zhenishbek uulu' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: UserRolesEnum.USER, enum: UserRolesEnum })
  @IsOptional()
  @IsString()
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;
}
