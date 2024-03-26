import { Global, Module } from '@nestjs/common';
import { TestingService } from './services/testing.service';
import { TestingController } from './controllers/testing.controller';
import { UtilsModule } from '../utils/utils.module';
import { TestingGateway } from './testing.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestingEntity } from './entities/testing.entity';
import { ParticipantEntity } from './entities/participant.entity';
import { SelectedAnswerEntity } from './entities/selected-answer.entity';
import { UserEntity } from '../user/entities/user.entity';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { ParticipantController } from './controllers/participant.controller';
import { ParticipantService } from './services/participant.service';
import { SelectedAnswerController } from './controllers/selected-answer.controller';
import { SelectedAnswerService } from './services/selected-answer.service';
import { QuestionEntity } from '../quiz/entities/question.entity';
import { AnswerEntity } from '../quiz/entities/answer.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { QuizModule } from '../quiz/quiz.module';

@Module({
  imports: [
    UtilsModule,
    JwtModule,
    ConfigModule,
    QuizModule,
    TypeOrmModule.forFeature([
      TestingEntity,
      ParticipantEntity,
      SelectedAnswerEntity,
      UserEntity,
      QuizEntity,
      QuestionEntity,
      AnswerEntity,
    ]),
  ],
  controllers: [
    TestingController,
    ParticipantController,
    SelectedAnswerController,
  ],
  providers: [
    TestingService,
    TestingGateway,
    ParticipantService,
    SelectedAnswerService,
  ],
})
export class TestingModule {}
