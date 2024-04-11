import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTestingDto } from '../dto/testing/create-testing.dto';
import { UpdateTestingDto } from '../dto/testing/update-testing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestingEntity } from '../entities/testing.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../../utils/utils.service';
import { QuizEntity } from '../../quiz/entities/quiz.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { TestingQueryDto } from '../dto/testing/testing-query.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { ParticipantEntity } from '../entities/participant.entity';
import { TestingStatusEnum } from '../enum/testing-status.enum';

@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(TestingEntity)
    private testingRepository: Repository<TestingEntity>,
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ParticipantEntity)
    private participantRepository: Repository<ParticipantEntity>,
    private utils: UtilsService,
  ) {}

  async create(createTestingDto: CreateTestingDto): Promise<TestingEntity> {
    const { quiz, owner, ...rest } = createTestingDto;
    const temp = {};

    const quizObject = await this.utils.getObjectOr404<QuizEntity>(
      this.quizRepository,
      { where: { id: quiz }, relations: ['user'] },
      'Quiz',
    );

    temp['quiz'] = quizObject;
    if (quizObject.isFrozen) {
      throw new ForbiddenException({
        message: 'Quiz is frozen. You cannot use this quiz',
      });
    }

    if (!quizObject.isPublished) {
      throw new ForbiddenException({
        message: 'Quiz is private. You cannot use this quiz',
      });
    }

    temp['owner'] = await this.utils.getObjectOr404<UserEntity>(
      this.userRepository,
      { where: { id: owner } },
      'User',
    );

    const testing = this.testingRepository.create({
      ...rest,
      ...temp,
      code: await this.makeCode(),
    });
    return await this.testingRepository.save(testing);
  }

  async findAll(
    query: TestingQueryDto,
  ): Promise<IComplexRequest<TestingEntity[]>> {
    const { limit, offset, search, quiz, owner, participant, ...filterQuery } =
      query;
    const relationFilterQuery = [];

    if (quiz) {
      relationFilterQuery.push({
        query: 'quiz.id = :id',
        value: { id: quiz },
      });
    }

    if (owner) {
      relationFilterQuery.push({
        query: 'user.id = :id',
        value: { id: owner },
      });
    }

    if (participant) {
      relationFilterQuery.push({
        query: 'participant.id = :id',
        value: { id: participant },
      });
    }

    return await this.utils.complexRequest<TestingEntity>({
      entity: 'testing',
      repository: this.testingRepository,
      filterQuery,
      limit,
      offset,
      search,
      searchFields: ['code'],
      relations: [
        { field: 'owner', entity: 'user' },
        { field: 'quiz', entity: 'quiz' },
        { field: 'participants', entity: 'participant' },
      ],
      relationFilterQuery,
    });
  }

  async findOne(id: number): Promise<TestingEntity> {
    const testing = await this.testingRepository.findOne({
      where: { id },
      relations: ['participants', 'owner', 'quiz'],
    });
    if (!testing) throw new NotFoundException({ message: 'Testing not found' });
    return testing;
  }

  async findOneByCode(
    code: string,
    raiseException = true,
  ): Promise<TestingEntity> {
    const testing = await this.testingRepository.findOne({
      where: { code, status: TestingStatusEnum.PENDING },
      relations: ['participants', 'owner'],
    });
    if (!testing && raiseException)
      throw new NotFoundException({ message: 'Testing not found' });
    return testing;
  }

  async update(id: number, updateTestingDto: UpdateTestingDto) {
    const testing = await this.testingRepository.findOneBy({ id });
    if (!testing) throw new NotFoundException({ message: 'Testing not found' });
    const { quiz, owner, ...rest } = updateTestingDto;

    if (quiz) {
      testing.quiz = await this.utils.getObjectOr404<QuizEntity>(
        this.quizRepository,
        {
          where: { id },
        },
        'Quiz',
      );
    }

    if (owner) {
      testing.owner = await this.utils.getObjectOr404<UserEntity>(
        this.userRepository,
        { where: { id } },
        'User',
      );
    }

    await this.testingRepository.save({ ...testing, ...rest });

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const testing = await this.testingRepository.findOneBy({ id });
    if (!testing) throw new NotFoundException({ message: 'Testing not found' });
    await testing.remove();
  }

  private async makeCode(): Promise<string> {
    while (true) {
      const code = String(Math.floor(Math.random() * 100000000));
      const testing = await this.findOneByCode(code, false);
      if (!testing) {
        return code;
      }
    }
  }

  async getTestingAccessKey(id: number) {
    const testing = await this.testingRepository.findOne({
      where: { id },
      select: ['accessKey'],
    });
    if (!testing) throw new NotFoundException({ message: 'Testing not found' });
    return testing;
  }
}
