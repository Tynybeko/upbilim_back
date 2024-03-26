import { Module } from '@nestjs/common';
import { RateService } from './services/rate.service';
import { RateController } from './controllers/rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { RateEntity } from './entities/rate.entity';
import { UserRateEntity } from './entities/user-rate.entity';
import { RateAttributeEntity } from './entities/rate-attribute.entity';
import { UtilsModule } from '../utils/utils.module';
import { RateAttributeService } from './services/rate-attribute.service';
import { RateAttributesController } from './controllers/rate-attribute.controller';
import { RateSystemService } from './services/rate-system.service';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { UserRateOwnerGuard } from './guards/user-rate-owner.guard';
import { UserRateController } from './controllers/user-rate.controller';
import { UserRateService } from './services/user-rate.service';
import { SubjectEntity } from '../subject/entities/subject.entity';
import { QuestionEntity } from '../quiz/entities/question.entity';
import { RateApplicationController } from './controllers/rate-application.controller';
import { RateApplicationService } from './services/rate-application.service';
import { RateApplicationEntity } from './entities/rate-application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RateEntity,
      UserRateEntity,
      RateAttributeEntity,
      QuizEntity,
      SubjectEntity,
      QuestionEntity,
      RateApplicationEntity,
    ]),
    UtilsModule,
  ],
  controllers: [
    RateController,
    RateAttributesController,
    UserRateController,
    RateApplicationController,
  ],
  providers: [
    RateService,
    RateAttributeService,
    RateSystemService,
    UserRateOwnerGuard,
    UserRateService,
    RateApplicationService,
  ],
  exports: [RateSystemService],
})
export class RateModule {}
