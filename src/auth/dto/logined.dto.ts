import { ApiProperty } from '@nestjs/swagger';

export class LoginedResDto {
    @ApiProperty({ example: 2 })
    id: number;

    @ApiProperty({ example: null })
    avatar: any;

    @ApiProperty({ example: '14324123213asdasd' })
    username: string;

    @ApiProperty({ example: null })
    phone: any;

    @ApiProperty({ example: 'tynybeko1122@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Tynybek' })
    firstName: string;

    @ApiProperty({ example: 'Zhanybekov' })
    lastName: string;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: 'user' })
    role: string;

    @ApiProperty({ example: null })
    student: any;

    @ApiProperty({ example: null })
    teacher: any;

    @ApiProperty({ example: 'token' })
    access_token: string;

    @ApiProperty({ example: 'token' })
    refresh_token: string;
}
