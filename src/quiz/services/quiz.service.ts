import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto } from '../dto/quiz/create-quiz.dto';
import { UpdateQuizDto } from '../dto/quiz/update-quiz.dto';
import { FileService } from '../../file/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizEntity } from '../entities/quiz.entity';
import { In, Repository } from 'typeorm';
import { SubjectEntity } from '../../subject/entities/subject.entity';
// import { KlassEntity } from '../../klass/entities/klass.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { UtilsService } from '../../utils/utils.service';
import { QuizQueryDto } from '../dto/quiz/quiz-query.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { LangEntity } from 'src/langs/entities/langs.entity';
import { GroupEntity } from 'src/group/entities/group.entity';

@Injectable()
export class QuizService {
  constructor(
    private fileService: FileService,
    private utils: UtilsService,
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    @InjectRepository(SubjectEntity)
    private subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(LangEntity)
    private langRepository: Repository<LangEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>
  ) { }

  // validateCreation(dto: CreateQuizDto): boolean {
  //   const { isORT, user, lang } = dto;
  //   if (isORT && klasses?.length === 0) {
  //     throw new BadRequestException({
  //       klasses: ['Should not be empty if it is ORT test'],
  //     });
  //   }
  //   if (!isORT && klasses?.length > 0) {
  //     throw new BadRequestException({
  //       klasses: ['Should be empty if it is not ORT test'],
  //     });
  //   }
  //   if (isORT && user) {
  //     throw new BadRequestException({
  //       user: ['Should be empty if it is ORT test'],
  //     });
  //   }

  //   if (!isORT && !user) {
  //     throw new BadRequestException({
  //       user: ["Shouldn't be empty if it is not ORT test"],
  //     });
  //   }

  //   return true;
  // }

  // async validateUpdating(dto: UpdateQuizDto, quiz: QuizEntity) {
  //   // const isORT = dto.isORT ?? quiz.isORT;
  //   // const klasses = dto.klasses !== undefined ? dto.klasses : quiz.klasses;
  //   const user = dto.user ?? quiz.user;

  //   // if (isORT && klasses?.length === 0) {
  //   //   throw new BadRequestException({
  //   //     klasses: ['Should not be empty if it is ORT test'],
  //   //   });
  //   // }
  //   // if (!isORT && klasses?.length > 0) {
  //   //   throw new BadRequestException({
  //   //     klasses: ['Should be empty if it is not ORT test'],
  //   //   });
  //   // }
  //   // if (isORT && user) {
  //   //   throw new BadRequestException({
  //   //     user: ['Should be empty if it is ORT test'],
  //   //   });
  //   // }

  //   // if (!isORT && !user) {
  //   //   throw new BadRequestException({
  //   //     user: ["Shouldn't be empty if it is not ORT test"],
  //   //   });
  //   // }
  // }

  async create(dto: CreateQuizDto) {
    // this.validateCreation(dto);
    const { image, icon, subject, lang, user, ...rest } = dto;
    const temp = { image: null };
    if (subject) {
      const mySubject = await this.utils.getObjectOr404<SubjectEntity>(
        this.subjectRepository,
        { where: { id: subject }, relations: ['group',] },
        'Subject',
      );
      temp['subject'] = mySubject
      temp['group'] = await this.utils.getObjectOr404<GroupEntity>(
        this.groupRepository,
        { where: { id: mySubject.group.id } },
        'Group',
      );

    }

    if (lang) {
      temp['lang'] = await this.utils.getObjectOr404<LangEntity>(
        this.langRepository,
        { where: { id: lang } },
        'Lang',
      );
    }


    if (user) {
      temp['user'] = await this.utils.getObjectOr404<UserEntity>(
        this.userRepository,
        { where: { id: user } },
        'User',
      );
    } else {
      temp['user'] = null;
    }
    if (image) {
      temp['image'] = await this.fileService.createFile('quiz_images', image);
    }
    if (icon) {
      temp['icon'] = await this.fileService.createFile('quiz_icons', icon);
    }
    const quiz = this.quizRepository.create({ ...rest, ...temp });
    return await this.quizRepository.save(quiz);
  }

  async findAll(query: QuizQueryDto): Promise<IComplexRequest<QuizEntity[]>> {
    const { subject, user, search, lang, limit, group, offset, ...filterQuery } =
      query;
    const relationFilterQuery = [];
    if (user) {
      relationFilterQuery.push({
        query: 'user.id = :id',
        value: { id: user },
      });
    }

    if (lang) {
      relationFilterQuery.push({
        query: 'lang.id = :id',
        value: { id: lang },
      });
    }

    if (group) {
      relationFilterQuery.push({
        query: 'group.id = :id',
        value: { id: group },
      });
    }
    if (subject) {
      relationFilterQuery.push({
        query: 'subject.id = :id',
        value: { id: subject },
      });
    }

    return await this.utils.complexRequest<QuizEntity>({
      entity: 'quiz',
      repository: this.quizRepository,
      filterQuery,
      search,
      searchFields: ['title', 'description'],
      offset,
      limit,
      relationFilterQuery,
      relations: [
        { entity: 'subject', field: 'subject' },
        { entity: 'user', field: 'user' },
        { entity: 'group', field: 'group' },
        { entity: 'lang', field: 'lang' },
      ],
    });
  }

  async findOne(id: number): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findOne({ where: { id }, relations: ['group', 'lang', 'subject'] });
    if (!quiz) throw new NotFoundException({ message: 'Quiz not found' });
    return quiz;
  }

  async update(id: number, updateQuizDto: UpdateQuizDto): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findOneBy({ id });
    if (!quiz) throw new NotFoundException({ message: 'Quiz not found' });
    // await this.validateUpdating(updateQuizDto, quiz);
    const { image, icon, subject, lang, user, ...rest } = updateQuizDto;
    const temp = { image: null };

    if (subject) {
      quiz.subject = await this.utils.getObjectOr404<SubjectEntity>(
        this.subjectRepository,
        { where: { id: subject } },
        'Subject',
      );
    }
    if (lang) {
      quiz.lang = await this.utils.getObjectOr404<LangEntity>(
        this.langRepository,
        { where: { id: lang } },
        'Lang',
      );
    }


    if (user) {
      quiz.user = await this.utils.getObjectOr404<UserEntity>(
        this.userRepository,
        { where: { id: user } },
        'User',
      );
    }


    if (user == 0) {
      quiz.user = null;
    }

    if (image) {
      if (quiz.image) this.fileService.removeFile(quiz.image, false);
      temp['image'] = await this.fileService.createFile('quiz_images', image);
    }

    if (icon) {
      if (quiz.icon) this.fileService.removeFile(quiz.icon, false);
      temp['icon'] = await this.fileService.createFile('quiz_icons', icon);
    }

    await this.quizRepository.save({ ...quiz, ...temp, ...rest });

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const quiz = await this.quizRepository.findOneBy({ id });
    if (!quiz) throw new NotFoundException({ message: 'Quiz not found' });
    if (quiz.image) this.fileService.removeFile(quiz.image, false);
    if (quiz.icon) this.fileService.removeFile(quiz.icon, false);
    await quiz.remove();
  }
}
