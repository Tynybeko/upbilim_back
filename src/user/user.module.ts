import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from '../utils/utils.module';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { TeacherEntity } from './entities/teacher.entity';
import { StudentEntity } from './entities/student.entity';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { TeacherController } from './controllers/teacher.controller';
import { TeacherService } from './services/teacher.service';
import { SchoolEntity } from '../school/entities/school.entity';
import { GroupEntity } from '../group/entities/group.entity';
import { ParticipantEntity } from '../testing/entities/participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizEntity,
      TeacherEntity,
      StudentEntity,
      GroupEntity,
      SchoolEntity,
      UserEntity,
      ParticipantEntity,
    ]),
    forwardRef(() => AuthModule),
    FileModule,
    ConfigModule,
    UtilsModule,
  ],
  controllers: [UserController, StudentController, TeacherController],
  providers: [UserService, StudentService, TeacherService],
  exports: [UserService],
})
export class UserModule {}
