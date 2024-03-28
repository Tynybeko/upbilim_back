import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseInterface } from './interfaces/register-response.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordInterface } from './interfaces/change-password.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { IAccessTokenPayload, IFullToken } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { FileService } from '../file/file.service';
import { UtilsService } from '../utils/utils.service';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    private filesService: FileService,

    private utils: UtilsService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getByUsernameWithPassword(email);
    if (!user) return null;
    const passwordEquals = await bcryptjs.compare(password, user.password);
    if (user && passwordEquals) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async checkUser(userId: number): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    if (!user.isActive) {
      throw new ForbiddenException({
        message: ['Пользователь забанен'],
      });
    }
    return true;
  }

  login(user: UserEntity): LoginResponseInterface {
    const payload: IAccessTokenPayload = {
      username: user.email,
      sub: user.id,
      role: user.role,
    };
    const tokens = this.makeToken(payload);
    return {
      ...user,
      ...tokens,
    };
  }

  async getNewTokens(
    user: UserEntity,
    refreshToken: string,
  ): Promise<IFullToken> {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('REFRESH_SECRET_KEY'),
      });
    } catch (err) {
      throw new UnauthorizedException({
        message: 'Expired refresh or invalid token',
      });
    }

    const result = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.config.get<string>('REFRESH_SECRET_KEY'),
    });

    if (!result) {
      throw new UnauthorizedException({ message: 'Invalid refresh token' });
    }

    const payload: IAccessTokenPayload = {
      username: user.email,
      sub: user.id,
      role: user.role,
    };

    return this.makeToken(payload);
  }

  makeToken(payload: IAccessTokenPayload): IFullToken {
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '2m',
        secret: this.config.get('ACCESS_SECRET_KEY'),
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: this.config.get('REFRESH_SECRET_KEY'),
      }),
    };
  }

  async profile(id: number): Promise<UserEntity> {
    return await this.userService.findOne(id);
  }

  async register(
    dto: RegisterDto,
    avatar: Express.Multer.File,
  ): Promise<LoginResponseInterface> {
    if (
      dto.role === UserRolesEnum.ADMIN ||
      dto.role === UserRolesEnum.MANAGER
    ) {
      throw new BadRequestException({
        message: 'Role must be user or teacher',
      });
    }
    const user = await this.userService.create(
      {
        ...dto,
        isActive: true,
      },
      avatar,
    );
    return this.login(user);
  }

  async changePassword(
    id: number,
    dto: ChangePasswordDto,
  ): Promise<ChangePasswordInterface> {
    const user = await this.userService.findOneWithPassword(id);
    if (!user) {
      return {
        isChanged: false,
        message: 'Пользователь не существует',
        status: HttpStatus.NOT_FOUND,
      };
    }
    const passwordEquals = await bcryptjs.compare(
      dto.oldPassword,
      user.password,
    );
    if (!passwordEquals) {
      return {
        isChanged: false,
        message: 'Старый пароль неверный',
        oldPassword: ['Старый пароль неверный'],
        status: HttpStatus.BAD_REQUEST,
      };
    }
    const hashPassword = await bcryptjs.hash(dto.newPassword, 10);
    await this.userRepository.update({ id }, { password: hashPassword });
    return {
      isChanged: true,
      message: 'Пароль был успешно изменен',
      status: HttpStatus.OK,
    };
  }

  async changeProfile(
    id: number,
    dto: ChangeProfileDto,
    avatar: Express.Multer.File = null,
  ): Promise<LoginResponseInterface> {
    const user = await this.userService.findOne(id);
    if (avatar) {
      if (user.avatar) this.filesService.removeFile(user.avatar, false);
      const avatarPath = await this.filesService.createFile(
        'user_avatars',
        avatar,
      );
      await this.userRepository.update({ id }, { ...dto, avatar: avatarPath });
    } else {
      await this.userRepository.update({ id }, dto);
    }
    const updatedUser = await this.userService.findOne(id);
    return this.login(updatedUser);
  }
  async loginWithAcces(token: string) {
    const user = this.jwtService.decode(token)
    if (!user) {
      throw new BadRequestException('Токен не действителен')
    }
    const logineduser = await this.validateUser(typeof user == 'object' ? user.email : '', this.config.get<string>('PASSWORD_FOR_ACCOUNT_GOOGLE'),)
    return this.login(logineduser)
  }

  async checkAcces(token: string) {
    return await this.jwtService.verify(token, { secret: this.config.get('ACCESS_SECRET_KEY'), })
  }


  async googleValidate(googleDto: GoogleAuthDto) {
    const checkUser = await this.userRepository.findOne({ where: { email: googleDto.email } })
    if (checkUser) {
      return this.login(checkUser)
    }
    const newUser: RegisterDto = {
      username: googleDto.id,
      lastName: googleDto.familyName,
      firstName: googleDto.givenName,
      password: process.env.PASSWORD_FOR_ACCOUNT_GOOGLE,
      role: UserRolesEnum.USER,
      email: googleDto.email,
      phone: null,
    }
    return this.register(newUser, null)
  }
}
