import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UtilsModule } from './utils/utils.module';
import { typeormOptions } from './options/typeorm.options';
import { QuizModule } from './quiz/quiz.module';
// import { KlassModule } from './klass/klass.module';
import { SubjectModule } from './subject/subject.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { TestingModule } from './testing/testing.module';
import { PostModule } from './post/post.module';
import { SchoolModule } from './school/school.module';
import { DistrictModule } from './district/district.module';
import { RateModule } from './rate/rate.module';
import { MailingModule } from './mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { GroupModule } from './group/group.module';
import { RegionModule } from './region/region.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CountryModule } from './country/country.module'
import { LangModule } from './langs/langs.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    TypeOrmModule.forRootAsync(typeormOptions),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    NestjsFormDataModule,
    AuthModule,
    FileModule,
    UserModule,
    UtilsModule,
    QuizModule,
    // KlassModule,
    SubjectModule,
    TestingModule,
    PostModule,
    SchoolModule,
    DistrictModule,
    RateModule,
    MailingModule,
    GroupModule,
    RegionModule,
    CountryModule,
    LangModule
  ],
})
export class AppModule { }
