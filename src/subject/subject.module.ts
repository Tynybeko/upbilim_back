import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from './entities/subject.entity';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { GroupEntity } from 'src/group/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubjectEntity, QuizEntity, GroupEntity]),
    AuthModule,
    UtilsModule,
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
})

export class SubjectModule { }
