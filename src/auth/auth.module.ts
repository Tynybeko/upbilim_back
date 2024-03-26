import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';
import { FileModule } from '../file/file.module';
import { UtilsModule } from '../utils/utils.module';
import { ValidatorModule } from '../validators/validator.module';
import { RtStrategy } from './strategy/rt.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { ParticipantEntity } from '../testing/entities/participant.entity';
import { GoogleStrategy } from './googleAuth/GoogleStrategy';
import { SessionSerialize } from './googleAuth/Serialize';

@Module({
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy, RtStrategy,  GoogleStrategy, SessionSerialize],
  controllers: [AuthController],
  imports: [
    PassportModule,
    FileModule,
    forwardRef(() => UserModule),
    ConfigModule,
    UtilsModule,
    ValidatorModule,
    TypeOrmModule.forFeature([UserEntity, ParticipantEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_SECRET_KEY'),
      }),
    }),
  ],
  exports: [JwtModule, AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
