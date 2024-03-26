import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEntity } from './entities/school.entity';
import { TeacherEntity } from '../user/entities/teacher.entity';
import { DistrictEntity } from '../district/entities/district.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchoolEntity, TeacherEntity, DistrictEntity]),
    UtilsModule,
  ],
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
