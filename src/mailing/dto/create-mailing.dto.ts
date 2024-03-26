import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Validate } from 'class-validator';
import { UniqueValidator } from '../../validators/unique.validator';
import { UserEntity } from '../../user/entities/user.entity';
import { MailingEntity } from '../entities/mailing.entity';

export class CreateMailingDto {
  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @Validate(UniqueValidator, [{ table: MailingEntity, column: 'email' }], {
    message: 'Email is already used for mailing',
  })
  email: string;
}
