import { Module } from '@nestjs/common';
import { QuizService } from './services/quiz.service';
import { QuizController } from './controllers/quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './entities/question.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileModule } from '../file/file.module';
import { SubjectEntity } from '../subject/entities/subject.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UtilsModule } from '../utils/utils.module';
import { QuizEntity } from './entities/quiz.entity';
import { AuthModule } from '../auth/auth.module';
import { AnswerEntity } from './entities/answer.entity';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { AnswerController } from './controllers/answer.controller';
import { AnswerService } from './services/answer.service';
import { RateModule } from '../rate/rate.module';
import { GroupEntity } from 'src/group/entities/group.entity';
import { LangEntity } from 'src/langs/entities/langs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizEntity,
      QuestionEntity,
      AnswerEntity,
      SubjectEntity,
      GroupEntity,
      UserEntity,
      LangEntity
    ]),
    NestjsFormDataModule,
    FileModule,
    UtilsModule,
    AuthModule,
    RateModule,
  ],
  controllers: [QuizController, QuestionController, AnswerController],
  providers: [QuizService, QuestionService, AnswerService],
  exports: [QuizService, QuestionService, AnswerService],
})
export class QuizModule {}
