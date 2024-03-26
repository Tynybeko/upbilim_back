import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UniqueValidator } from '../../../validators/unique.validator';
import { UserEntity } from '../../entities/user.entity';
import { UserRolesEnum } from '../../enums/user-roles.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user' })
  @IsString()
  @Validate(UniqueValidator, [{ table: UserEntity, column: 'username' }], {
    message: 'Такое имя пользователя уже занято',
  })
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: '********' })
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
  @IsString()
  @IsPhoneNumber()
  @Validate(UniqueValidator, [{ table: UserEntity, column: 'phone' }], {
    message: 'Пользователь с таким номером телефона уже существует',
  })
  phone: string;

  @ApiProperty({ example: 'oroz@gmail.com' })
  @IsString()
  @IsEmail({})
  @Validate(UniqueValidator, [{ table: UserEntity, column: 'email' }], {
    message: 'Пользователь с таким электронной почтой уже существует',
  })
  email: string;

  @ApiProperty({ example: 'oroz' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'zhenish' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: true })
  @Transform(({ obj, key }) => obj[key] !== 'false' && obj[key] !== false)
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: UserRolesEnum.USER, enum: UserRolesEnum })
  @IsString()
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;
}
