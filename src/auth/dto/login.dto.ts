import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'oroz' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'pythondjango' })
  @IsString()
  password: string;
}
