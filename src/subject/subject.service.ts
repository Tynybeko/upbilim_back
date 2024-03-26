import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectEntity } from './entities/subject.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../utils/dto/pagination-query.dto';
import { UtilsService } from '../utils/utils.service';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { GroupEntity } from 'src/group/entities/group.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    private utils: UtilsService,
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>
  ) { }

  async create(createSubjectDto: CreateSubjectDto): Promise<SubjectEntity> {
    const { group, ...rest } = createSubjectDto
    const temp = {}
    if (group) {
      temp['group'] = await this.utils.getObjectOr404<GroupEntity>(
        this.groupRepository,
        { where: { id: group } },
        'Group',
      );
    }
    const subject = this.subjectRepository.create({ ...rest, ...temp });
    return await this.subjectRepository.save(subject);
  }


  async createForJSON(data: any[]) {
    if (!Array.isArray(data)) throw new BadRequestException({ file: 'Должен быть массив данных!' })
    const uniqueIds = new Set();

    const result = []
    for (const item of data) {
      for (const key in item) {
        if (!item[key]) {
          throw new BadRequestException({ file: `Укажите нормальные данные в ${item.id} ID - ${key}` });
        }
      }
      if (uniqueIds.has(item.id)) {
        throw new BadRequestException({ file: `Дублирующийся элемент с ID: ${item.id}` });
      } else {
        uniqueIds.add(item.id);
      }


      await this.utils.getObjectOr404<GroupEntity>(
        this.groupRepository,
        { where: { id: item.groupId } },
        'Group',
      );
      item['group'] = item.groupId
    }
    for (let item of data) {
      result.push(await this.create(item))
    }
    return result
  }


  async findAll(
    query: PaginationQueryDto,
  ): Promise<IComplexRequest<SubjectEntity[]>> {
    return await this.utils.complexRequest<SubjectEntity>({
      entity: 'subject',
      repository: this.subjectRepository,
      searchFields: ['label', 'label_kg', 'label_uz', 'label_kz', 'label_en'],
      ...query,
    });
  }

  async findOne(id: number): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOneBy({ id });
    if (!subject) throw new NotFoundException({ message: 'Subject not found' });
    return subject;
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectEntity> {
    const { group, ...rest } = updateSubjectDto
    const temp = {}
    if (group) {
      temp['group'] = await this.utils.getObjectOr404<GroupEntity>(
        this.groupRepository,
        { where: { id: group } },
        'Group',
      );
    }


    await this.subjectRepository.update({ id }, { ...rest, ...temp });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.findOne(id);
    await subject.remove();
  }

  async findAllWithCountQuizzers(user: UserEntity) {
    const temp = [];
    const subjects = await this.subjectRepository.find();
    for (const subject of subjects) {
      const quizzersQueryBuilder = this.quizRepository
        .createQueryBuilder('quiz')
        .leftJoinAndSelect('quiz.subjects', 'subject')
        .leftJoinAndSelect('quiz.user', 'user')
        .where('subject.id = :id', { id: subject.id });
      if (user.role === UserRolesEnum.MANAGER) {
        quizzersQueryBuilder.andWhere({ isORT: true });
      } else {
        quizzersQueryBuilder.andWhere('user.id = :id', { id: user.id });
      }

      const quizzersCount = await quizzersQueryBuilder.getCount();
      temp.push({ ...subject, quizzersCount });
    }
    return temp.sort((a, b) => a.quizzersCount + b.quizzersCount);
  }
}
