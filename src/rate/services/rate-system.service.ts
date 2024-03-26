import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizEntity } from '../../quiz/entities/quiz.entity';
import { In, Repository } from 'typeorm';
import { UserRateEntity } from '../entities/user-rate.entity';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { CreateQuizDto } from '../../quiz/dto/quiz/create-quiz.dto';
import { UpdateQuizDto } from '../../quiz/dto/quiz/update-quiz.dto';
import { RateEntity } from '../entities/rate.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ForbiddenMessageInterface } from '../interfaces/forbidden-message.interface';
import { UpdateQuestionDto } from '../../quiz/dto/question/update-question.dto';
import { CreateQuestionDto } from '../../quiz/dto/question/create-question.dto';
import { QuestionEntity } from '../../quiz/entities/question.entity';
import { SubjectEntity } from '../../subject/entities/subject.entity';

@Injectable()
export class RateSystemService {
  private readonly logger = new Logger(RateSystemService.name);

  constructor(
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    @InjectRepository(UserRateEntity)
    private userRateRepository: Repository<UserRateEntity>,
    @InjectRepository(RateEntity)
    private rateRepository: Repository<RateEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(SubjectEntity)
    private subjectRepository: Repository<SubjectEntity>,
  ) { }

  async checkQuizCreation(
    user: UserEntity,
    createQuizDto: CreateQuizDto,
  ): Promise<boolean> {
    if (this.isSuperUser(user)) return true;
    const forbiddenMessages: ForbiddenMessageInterface[] = [];
    const userRate = await this.getUserRate(user.id);
    const isExpired = await this.checkUserRateExpiration(userRate);
    if (isExpired || !userRate) {
      const rate = await this.getFreemiumRate();
      await this.checkQuizzersAmount(
        createQuizDto,
        user,
        rate,
        forbiddenMessages,
      );
      await this.checkQuizzersAllowedSubjects(
        createQuizDto,
        user,
        rate,
        forbiddenMessages,
      );
    } else {
      await this.checkQuizzersAmount(
        createQuizDto,
        user,
        userRate.rate,
        forbiddenMessages,
      );
      await this.checkQuizzersAllowedSubjects(
        createQuizDto,
        user,
        userRate.rate,
        forbiddenMessages,
      );
    }
    if (forbiddenMessages.length > 0) {
      throw new ForbiddenException(forbiddenMessages);
    }
    return true;
  }

  async checkQuizUpdating(
    user: UserEntity,
    updateQuizDto: UpdateQuizDto,
    quizId: number,
  ): Promise<boolean> {
    if (this.isSuperUser(user)) return true;

    const forbiddenMessages: ForbiddenMessageInterface[] = [];
    const userRate = await this.getUserRate(user.id);
    const quiz = await this.quizRepository.findOneBy({ id: quizId });
    if (!quiz) throw new NotFoundException({ message: 'Quiz is not found' });
    if (quiz.isFrozen)
      throw new NotFoundException({
        message: 'Quiz is frozen. You cannot edit this quiz',
      });
    const isExpired = await this.checkUserRateExpiration(userRate);
    if (isExpired || !userRate) {
      const rate = await this.getFreemiumRate();
      await this.checkQuizzersAmount(
        updateQuizDto,
        user,
        rate,
        forbiddenMessages,
      );
      await this.checkQuizzersAllowedSubjects(
        updateQuizDto,
        user,
        rate,
        forbiddenMessages,
      );
    } else if (
      updateQuizDto.isPublished !== undefined &&
      updateQuizDto.isPublished !== quiz.isPublished
    ) {
      await this.checkQuizzersAmount(
        updateQuizDto,
        user,
        userRate.rate,
        forbiddenMessages,
      );
      await this.checkQuizzersAllowedSubjects(
        updateQuizDto,
        user,
        userRate.rate,
        forbiddenMessages,
      );
    }
    if (forbiddenMessages.length > 0) {
      throw new ForbiddenException(forbiddenMessages);
    }
    return true;
  }

  private isSuperUser(user: UserEntity) {
    return (
      user.role === UserRolesEnum.MANAGER || user.role === UserRolesEnum.ADMIN
    );
  }

  private async getUserRate(userId: number): Promise<UserRateEntity> {
    return await this.userRateRepository.findOne({
      where: { user: { id: userId } },
      relations: ['rate'],
    });
  }

  async checkUserRateExpiration(userRate: UserRateEntity): Promise<boolean> {
    const now = new Date();
    return userRate.validity > now;
  }

  async checkQuizzersAmount(
    quiz: UpdateQuizDto | CreateQuizDto,
    user: UserEntity,
    rate: RateEntity,
    forbiddenMessages: ForbiddenMessageInterface[],
  ): Promise<void> {
    const quizQueryBuilder = this.quizRepository.createQueryBuilder();
    const publicQuizCount = await quizQueryBuilder
      .where({ isPublished: true, user: { id: user.id } })
      .getCount();

    if (publicQuizCount + 1 > rate.amountOfPublicTests && quiz.isPublished) {
      forbiddenMessages.push({
        message: `You're already have ${publicQuizCount} public quizzers. You cannot add new one or change privacy.`,
        type: 'amountOfPublicTests',
      });
    }

    const privateQuizCount = await quizQueryBuilder
      .where({ isPublished: false, user: { id: user.id } })
      .getCount();

    if (privateQuizCount + 1 > rate.amountOfHiddenTests && !quiz.isPublished) {
      forbiddenMessages.push({
        message: `You're already have ${privateQuizCount} private quizzers. You cannot add new one or change privacy.`,
        type: 'amountOfHiddenTests',
      });
    }
  }

  async checkQuestionCreation(
    user: UserEntity,
    createQuestionDto: CreateQuestionDto,
  ): Promise<boolean> {
    if (this.isSuperUser(user)) return true;
    const forbiddenMessages: ForbiddenMessageInterface[] = [];
    const userRate = await this.getUserRate(user.id);
    const isExpired = await this.checkUserRateExpiration(userRate);
    if (isExpired || !userRate) {
      const rate = await this.getFreemiumRate();
      await this.checkQuizzersQuestionCount(
        createQuestionDto,
        rate,
        forbiddenMessages,
      );
    } else {
      await this.checkQuizzersQuestionCount(
        createQuestionDto,
        userRate.rate,
        forbiddenMessages,
      );
    }

    if (forbiddenMessages.length > 0) {
      throw new ForbiddenException(forbiddenMessages);
    }
    return true;
  }

  async checkQuizzersQuestionCount(
    question: UpdateQuestionDto | CreateQuestionDto,
    rate: RateEntity,
    forbiddenMessages: ForbiddenMessageInterface[],
  ): Promise<void> {
    const allowedQuestionAmount = rate.amountOfQuestions;
    const quizId = question.quiz;
    if (quizId) {
      const questionQueryBuilder = this.questionRepository.createQueryBuilder();
      const questionsAmount = await questionQueryBuilder
        .where({ quiz: quizId })
        .getCount();
      if (allowedQuestionAmount < questionsAmount + 1) {
        forbiddenMessages.push({
          message: `You cannot add new question. Amount of questions for this quiz greater than ${allowedQuestionAmount}, now you already created ${questionsAmount}.`,
          type: 'amountOfQuestions',
        });
      }
    }
  }

  async checkQuizzersAllowedSubjects(
    quiz: UpdateQuizDto | CreateQuizDto,
    user: UserEntity,
    rate: RateEntity,
    forbiddenMessages: ForbiddenMessageInterface[],
  ) {
    if (quiz.subject) {
      const allowedSubjects = rate.subjects;
      const subjects = await this.subjectRepository.findBy({
        id: quiz.subject,
      });
      subjects.forEach((item) => {
        const isHad = allowedSubjects.some(
          (allowedSubject) => allowedSubject.id === item.id,
        );
        if (!isHad) {
          forbiddenMessages.push({
            message: `You cannot use the subject ${item.label}`,
            type: 'subjects',
          });
        }
      });
    }
  }

  async getFreemiumRate(): Promise<RateEntity> {
    return await this.rateRepository.findOneBy({ isFreemium: true });
  }

  async checkUserRateValidity(userId: number) {
    console.log('checking!');
    const user = await this.userRepository.findOneBy({ id: userId });
    const userRate = await this.userRateRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['rate'],
    });
    let rate: RateEntity | null = null;
    if (userRate) {
      const isExpired = await this.checkUserRateExpiration(userRate);
      if (isExpired) rate = await this.getFreemiumRate();
      else rate = userRate.rate;
    } else rate = await this.getFreemiumRate();
    const quizQueryBuilder = this.quizRepository.createQueryBuilder();

    const publicQuizCount = await quizQueryBuilder
      .where({ isPublished: true, user: { id: user.id } })
      .getCount();

    const privateQuizCount = await quizQueryBuilder
      .where({ isPublished: false, user: { id: user.id } })
      .getCount();

    if (privateQuizCount > rate.amountOfHiddenTests) {
      const extra = privateQuizCount - rate.amountOfHiddenTests;
      const quizzers = await quizQueryBuilder
        .where({ isPublished: false, user: { id: user.id } })
        .orderBy('created_at', 'ASC')
        .limit(extra)
        .getMany();
      await this.makeFrozen(quizzers);
    } else {
      const extra = rate.amountOfHiddenTests - privateQuizCount;
      const quizzers = await quizQueryBuilder
        .where({ isPublished: false, isFrozen: true, user: { id: user.id } })
        .orderBy('created_at', 'ASC')
        .limit(extra)
        .getMany();
      await this.dismissFrozen(quizzers);
    }
    if (publicQuizCount > rate.amountOfPublicTests) {
      const extra = publicQuizCount - rate.amountOfPublicTests;
      const quizzers = await quizQueryBuilder
        .where({ isPublished: true, user: { id: user.id } })
        .orderBy('created_at', 'ASC')
        .limit(extra)
        .getMany();
      await this.makeFrozen(quizzers);
    } else {
      const extra = rate.amountOfPublicTests - publicQuizCount;
      const quizzers = await quizQueryBuilder
        .where({ isPublished: true, isFrozen: true, user: { id: user.id } })
        .orderBy('created_at', 'ASC')
        .limit(extra)
        .getMany();
      await this.dismissFrozen(quizzers);
    }
  }

  private async makeFrozen(quizzers: QuizEntity[]) {
    for (const quiz of quizzers) {
      quiz.isFrozen = true;
      await this.quizRepository.save(quiz);
    }
  }

  private async dismissFrozen(quizzers: QuizEntity[]) {
    for (const quiz of quizzers) {
      quiz.isFrozen = false;
      await this.quizRepository.save(quiz);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  private async checkUserRateValidityRegularly() {
    const users = await this.userRepository.find({
      where: { role: In([UserRolesEnum.TEACHER, UserRolesEnum.USER]) },
    });
    for (const user of users) {
      await this.checkUserRateValidity(user.id);
    }
  }
}
