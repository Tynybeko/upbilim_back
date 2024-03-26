import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSelectedAnswerDto } from '../dto/selected-answer/create-selected-answer.dto';
import { UtilsService } from '../../utils/utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectedAnswerEntity } from '../entities/selected-answer.entity';
import { Repository } from 'typeorm';
import { ParticipantEntity } from '../entities/participant.entity';
import { QuestionEntity } from 'src/quiz/entities/question.entity';
import { AnswerEntity } from '../../quiz/entities/answer.entity';
import { SelectedQueryDto } from '../dto/selected-answer/selected-query.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { UpdateSelectedAnswerDto } from '../dto/selected-answer/update-selected-answer.dto';
import { TestingStatusEnum } from '../enum/testing-status.enum';

@Injectable()
export class SelectedAnswerService {
  constructor(
    private utils: UtilsService,
    @InjectRepository(SelectedAnswerEntity)
    private selectedAnswerRepository: Repository<SelectedAnswerEntity>,
    @InjectRepository(ParticipantEntity)
    private participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(AnswerEntity)
    private answerRepository: Repository<AnswerEntity>,
  ) {}

  async create(
    createSelectedAnswerDto: CreateSelectedAnswerDto,
  ): Promise<SelectedAnswerEntity> {
    const { participant, question, answer, point } = createSelectedAnswerDto;
    const selectedAnswer = new SelectedAnswerEntity();
    const participantInstance =
      await this.utils.getObjectOr404<ParticipantEntity>(
        this.participantRepository,
        { where: { id: participant }, relations: ['testing'] },
        'Participant',
      );

    if (participantInstance.testing.status !== TestingStatusEnum.IN_PROCESS) {
      throw new ForbiddenException({
        message: 'Status of testing should be ' + TestingStatusEnum.IN_PROCESS,
      });
    }

    selectedAnswer.participant = participantInstance;
    participantInstance.totalPoint += point;
    await participantInstance.save();
    selectedAnswer.question = await this.utils.getObjectOr404<QuestionEntity>(
      this.questionRepository,
      { where: { id: question } },
      'Question',
    );

    selectedAnswer.answer = await this.utils.getObjectOr404<AnswerEntity>(
      this.answerRepository,
      { where: { id: answer } },
      'Answer',
    );
    selectedAnswer.point = point;
    return await this.selectedAnswerRepository.save(selectedAnswer);
  }

  async findAll(
    query: SelectedQueryDto,
  ): Promise<IComplexRequest<SelectedAnswerEntity[]>> {
    const { participant, answer, question, limit, offset } = query;
    const relationFilterQuery = [];

    if (participant) {
      relationFilterQuery.push({
        query: 'participant.id = :id',
        value: { id: participant },
      });
    }

    if (answer) {
      relationFilterQuery.push({
        query: 'answer.id = :id',
        value: { id: answer },
      });
    }

    if (question) {
      relationFilterQuery.push({
        query: 'question.id = :id',
        value: { id: question },
      });
    }

    return await this.utils.complexRequest<SelectedAnswerEntity>({
      entity: 'selected_answer',
      repository: this.selectedAnswerRepository,
      relations: [
        { field: 'participant', entity: 'participant' },
        { field: 'answer', entity: 'answer' },
        { field: 'question', entity: 'question' },
      ],
      relationFilterQuery,
      limit,
      offset,
    });
  }

  async findOne(id: number): Promise<SelectedAnswerEntity> {
    const selectedAnswer = await this.selectedAnswerRepository.findOne({
      where: { id },
      relations: { question: true, participant: true },
    });

    if (!selectedAnswer) {
      throw new NotFoundException({ mesaage: 'Selected answer not found' });
    }

    return selectedAnswer;
  }

  async update(
    id: number,
    updateSelectedAnswerDto: UpdateSelectedAnswerDto,
  ): Promise<SelectedAnswerEntity> {
    const { participant, answer, point, question } = updateSelectedAnswerDto;
    const selectedAnswer = await this.selectedAnswerRepository.findOneBy({
      id,
    });

    if (!selectedAnswer) {
      throw new NotFoundException({ mesaage: 'Selected answer not found' });
    }

    if (participant) {
      selectedAnswer.participant =
        await this.utils.getObjectOr404<ParticipantEntity>(
          this.participantRepository,
          { where: { id: participant } },
          'Participant',
        );
    }

    if (answer) {
      selectedAnswer.answer = await this.utils.getObjectOr404<AnswerEntity>(
        this.answerRepository,
        { where: { id: answer } },
        'Answer',
      );
    }

    if (question) {
      selectedAnswer.question = await this.utils.getObjectOr404<QuestionEntity>(
        this.questionRepository,
        { where: { id: question } },
        'Question',
      );
    }

    if (point) selectedAnswer.point = point;

    await this.selectedAnswerRepository.save(selectedAnswer);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const selectedAnswer = await this.selectedAnswerRepository.findOneBy({
      id,
    });

    if (!selectedAnswer) {
      throw new NotFoundException({ mesaage: 'Selected answer not found' });
    }

    await selectedAnswer.remove();
  }
}
