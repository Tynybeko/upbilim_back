import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { UniqueValidator } from '../../validators/unique.validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';

export class RegisterDto {
  @ApiProperty({ example: 'oroz' })
  @IsString()
  @Validate(UniqueValidator, [{ table: UserEntity, column: 'username' }], {
    message: 'Такое имя пользователя уже занято',
  })
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'pythondjango' })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @ApiProperty({ example: '+996776780243' })
  @IsString()
  @IsPhoneNumber()
  @Validate(UniqueValidator, [{ table: UserEntity, column: 'phone' }], {
    message: 'Пользователь с таким номером телефона уже существует',
  })
  phone: string;

  @ApiProperty({ example: 'oroz@gmail.com' })
  @IsString()
  @IsEmail()
  @Validate(UniqueValidator, [{ table: UserEntity, column: 'email' }], {
    message: 'Пользователь с таким электронной почтой уже существует',
  })
  email: string;

  @ApiProperty({ example: 'Orozbek' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Zhenishbek uulu' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: UserRolesEnum.USER, enum: UserRolesEnum })
  @IsString()
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;
}
