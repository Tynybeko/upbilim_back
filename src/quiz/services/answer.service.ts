import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../entities/question.entity';
import { UtilsService } from '../../utils/utils.service';
import { FileService } from '../../file/file.service';
import { AnswerQueryDto } from '../dto/answer/answer-qeury.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { UpdateAnswerDto } from '../dto/answer/update-answer.dto';
import { AnswerEntity } from '../entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private answerRepository: Repository<AnswerEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    private utils: UtilsService,
    private fileService: FileService,
  ) {}

  async findAll(
    query: AnswerQueryDto,
  ): Promise<IComplexRequest<AnswerEntity[]>> {
    const { limit, offset, search, question, ...filterQuery } = query;
    const relationFilterQuery = [];

    if (question) {
      relationFilterQuery.push({
        query: 'question.id = :id',
        value: { id: question },
      });
    }

    return await this.utils.complexRequest<AnswerEntity>({
      entity: 'answer',
      repository: this.answerRepository,
      limit,
      offset,
      search,
      searchFields: ['value'],
      filterQuery,
      relationFilterQuery,
      relations: [{ entity: 'question', field: 'question' }],
    });
  }

  async findOne(id: number): Promise<AnswerEntity> {
    const answer = await this.answerRepository.findOneBy({ id });
    if (!answer) throw new NotFoundException({ message: 'Answer not found' });
    return answer;
  }

  async findOneForGuard(id: number): Promise<AnswerEntity> {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['question', 'question.quiz', 'question.quiz.user'],
    });
    if (!answer) throw new NotFoundException({ message: 'Answer not found' });
    return answer;
  }

  async update(
    id: number,
    updateAnswerDto: UpdateAnswerDto,
  ): Promise<AnswerEntity> {
    const answer = await this.answerRepository.findOneBy({ id });
    const { image, ...rest } = updateAnswerDto;
    const temp = {};

    if (image) {
      if (answer.image) this.fileService.removeFile(answer.image, false);
      temp['image'] = await this.fileService.createFile(
        'image',
        updateAnswerDto.image,
      );
    }

    await this.answerRepository.update({ id }, { ...rest, ...temp });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const answer = await this.findOne(id);
    if (answer.image) this.fileService.removeFile(answer.image, false);
    await answer.remove();
  }
}
