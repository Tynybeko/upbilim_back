import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controllers/application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachApplicationEntity } from './entities/teacher.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SchoolEntity } from 'src/school/entities/school.entity';
import { FileModule } from 'src/file/file.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [
    ApplicationService
  ],
  imports: [
    TypeOrmModule.forFeature([
      TeachApplicationEntity,
      UserEntity,
      SchoolEntity
    ]),
    FileModule,
    NestjsFormDataModule,
    UtilsModule
  ]

})
export class ApplicationModule { }
