import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from '../entities/question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { FileService } from '../../file/file.service';
import { UtilsService } from '../../utils/utils.service';
import { QuestionQueryDto } from '../dto/question/question-query.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { QuizEntity } from '../entities/quiz.entity';
import { AnswerEntity } from '../entities/answer.entity';

@Injectable()
export class QuestionService {
  constructor(
    private fileService: FileService,
    private utils: UtilsService,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    @InjectRepository(AnswerEntity)
    private answerRepository: Repository<AnswerEntity>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<QuestionEntity> {
    const { image, quiz, answers, ...rest } = createQuestionDto;
    const temp = { image: null };
    temp['quiz'] = await this.utils.getObjectOr404<QuizEntity>(
      this.quizRepository,
      { where: { id: quiz } },
      'Quiz',
    );
    if (image) {
      temp['image'] = await this.fileService.createFile(
        'image',
        createQuestionDto.image,
      );
    }
    const question = await this.questionRepository.create({ ...rest, ...temp });
    const savedQuestion = await this.questionRepository.save(question);

    for (const answer of answers) {
      const { image, ...answerRest } = answer;
      const answerTemp = { image: null };
      if (image) {
        answerTemp['image'] = await this.fileService.createFile(
          'image',
          answer.image,
        );
      }
      const newAnswer = await this.answerRepository.create({
        ...answerRest,
        ...answerTemp,
        question: savedQuestion,
      });
      await this.answerRepository.save(newAnswer);
    }

    return await this.findOne(savedQuestion.id);
  }

  async findAll(
    query: QuestionQueryDto,
  ): Promise<IComplexRequest<QuestionEntity[]>> {
    const { search, limit, offset, orderBy, order, quiz } = query;
    const relationFilterQuery = [];

    if (quiz) {
      relationFilterQuery.push({
        query: 'quiz.id = :id',
        value: { id: quiz },
      });
    }

    return await this.utils.complexRequest<QuestionEntity>({
      entity: 'question',
      repository: this.questionRepository,
      limit,
      offset,
      search,
      searchFields: ['title', 'content'],
      order: order || 'ASC',
      orderBy: orderBy || 'order',
      relations: [
        { field: 'answers', entity: 'answer' },
        { field: 'quiz', entity: 'quiz' },
      ],
      relationFilterQuery,
    });
  }

  async findOne(id: number): Promise<QuestionEntity> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: {
        answers: true,
        quiz: true,
      },
    });
    if (!question) {
      throw new NotFoundException({ message: 'Question not found' });
    }
    return question;
  }

  async remove(id: number): Promise<void> {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException({ message: 'Question not found' });
    }
    if (question.image) this.fileService.removeFile(question.image, false);
    await question.remove();
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionEntity> {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException({ message: 'Question not found' });
    }

    const { image, quiz, ...rest } = updateQuestionDto;
    const temp = {};

    if (quiz) {
      temp['quiz'] = await this.utils.getObjectOr404<QuizEntity>(
        this.quizRepository,
        { where: { id: quiz } },
        'Quiz',
      );
    }

    if (image) {
      if (question.image) this.fileService.removeFile(question.image, false);
      temp['image'] = await this.fileService.createFile(
        'image',
        updateQuestionDto.image,
      );
    }

    await this.questionRepository.update({ id }, { ...rest, ...temp });
    return await this.findOne(id);
  }
}
