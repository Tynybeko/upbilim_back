import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParticipantDto } from '../dto/participant/create-participant.dto';
import { ParticipantQueryDto } from '../dto/participant/participant-query.dto';
import { UpdateParticipantDto } from '../dto/participant/update-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipantEntity } from '../entities/participant.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { TestingEntity } from '../entities/testing.entity';
import { UtilsService } from '../../utils/utils.service';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { TestingGateway } from '../testing.gateway';
import { TestingStatusEnum } from '../enum/testing-status.enum';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(ParticipantEntity)
    private participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TestingEntity)
    private testingRepository: Repository<TestingEntity>,
    private utils: UtilsService,
    private testingGateway: TestingGateway,
  ) {}

  async create(
    createParticipantDto: CreateParticipantDto,
  ): Promise<ParticipantEntity> {
    const { user, testing, name } = createParticipantDto;
    const participant = new ParticipantEntity();

    const testingObject = await this.utils.getObjectOr404<TestingEntity>(
      this.testingRepository,
      { where: { id: testing } },
      'Testing',
    );

    if (testingObject.status !== TestingStatusEnum.PENDING) {
      throw new BadRequestException({
        message: 'Testing status should be pending',
      });
    }

    participant.testing = testingObject;

    if (user) {
      participant.user = await this.utils.getObjectOr404<UserEntity>(
        this.userRepository,
        { where: { id: user } },
        'User',
      );
    }

    participant.name = name;

    this.testingGateway.addNewParticipantToRoom(participant);

    return await this.participantRepository.save(participant);
  }

  async findAll(
    query: ParticipantQueryDto,
  ): Promise<IComplexRequest<ParticipantEntity[]>> {
    const { testing, user, search, klass, subject, group, limit, offset } =
      query;
    const relationFilterQuery = [];

    if (testing) {
      relationFilterQuery.push({
        query: 'testing.id = :id',
        value: { id: testing },
      });
    }

    if (user) {
      relationFilterQuery.push({
        query: 'user.id = :id',
        value: { id: user },
      });
    }

    if (klass) {
      relationFilterQuery.push({
        query: 'klass.id = :id',
        value: { id: klass },
      });
    }

    if (subject) {
      relationFilterQuery.push({
        query: 'subject.id = :id',
        value: { id: subject },
      });
    }

    if (group) {
      relationFilterQuery.push({
        query: 'group.id = :id',
        value: { id: group },
      });
    }

    return await this.utils.complexRequest<ParticipantEntity>({
      entity: 'participant',
      repository: this.participantRepository,
      relations: [
        { field: 'user', entity: 'user' },
        { field: 'user.student', entity: 'student' },
        { field: 'user.teacher', entity: 'teacher' },
        { field: 'user.student.group', entity: 'group' },
        { field: 'user.student.group.school', entity: 'school' },
        { field: 'user.student.group.school.district', entity: 'district' },
        { field: 'testing', entity: 'testing' },
        { field: 'testing.quiz', entity: 'quiz' },
        { field: 'testing.quiz.subjects', entity: 'subject' },
        { field: 'testing.quiz.klasses', entity: 'klass' },
      ],
      search,
      searchFields: ['name'],
      relationFilterQuery,
      limit,
      offset,
    });
  }

  async findOne(id: number): Promise<ParticipantEntity> {
    const participant = await this.participantRepository.findOne({
      where: { id },
      relations: [
        'user',
        'testing',
        'selectedAnswers',
        'testing.quiz',
        'testing.quiz.klasses',
        'testing.quiz.subjects',
        'user.teacher',
        'user.teacher.school',
        'user.teacher.school.district',
        'user.student',
        'user.student.group',
        'user.student.group.school',
        'user.student.group.school.district',
      ],
    });

    if (!participant) {
      throw new NotFoundException({ message: 'Participant not found' });
    }

    return participant;
  }

  async update(
    id: number,
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<ParticipantEntity> {
    const participant = await this.participantRepository.findOneBy({ id });
    if (!participant) {
      throw new NotFoundException({ message: 'Participant not found' });
    }
    const { user, testing, name } = updateParticipantDto;
    if (user) {
      participant.user = await this.utils.getObjectOr404<UserEntity>(
        this.userRepository,
        { where: { id: user } },
        'User',
      );
    }

    if (testing) {
      participant.testing = await this.utils.getObjectOr404<TestingEntity>(
        this.testingRepository,
        { where: { id: testing } },
        'Testing',
      );
    }

    if (name) {
      participant.name = name;
    }
    await this.participantRepository.save(participant);

    this.testingGateway.updateParticipantToRoom(await this.findOne(id));

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const participant = await this.participantRepository.findOneBy({ id });
    if (!participant) {
      throw new NotFoundException({ message: 'Participant not found' });
    }
    await participant.remove();

    this.testingGateway.removeParticipantToRoom(id, participant.testingId);
  }

  async findByAccessKey(participantKey: string): Promise<ParticipantEntity> {
    return await this.participantRepository.findOne({
      where: { accessKey: participantKey },
      select: ['accessKey'],
    });
  }
}
