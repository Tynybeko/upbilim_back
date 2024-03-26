import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRateDto } from '../dto/rate/create-rate.dto';
import { UpdateRateDto } from '../dto/rate/update-rate.dto';
import { UtilsService } from '../../utils/utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RateEntity } from '../entities/rate.entity';
import { In, Not, Repository } from 'typeorm';
import { RateAttributeEntity } from '../entities/rate-attribute.entity';
import { RateQueryDto } from '../dto/rate/rate-query.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { SubjectEntity } from '../../subject/entities/subject.entity';

@Injectable()
export class RateService {
  constructor(
    private utils: UtilsService,
    @InjectRepository(RateEntity)
    private rateRepository: Repository<RateEntity>,
    @InjectRepository(RateAttributeEntity)
    private rateAttributeRepository: Repository<RateAttributeEntity>,
    @InjectRepository(SubjectEntity)
    private subjectRepository: Repository<SubjectEntity>,
  ) {}

  async create(createRateDto: CreateRateDto): Promise<RateEntity> {
    const { attributes, subjects, ...rest } = createRateDto;
    const temp = {};

    if (rest.isFreemium) {
      const rate = await this.rateRepository.findOneBy({ isFreemium: true });
      if (rate)
        throw new BadRequestException({
          message: 'Only one rate can be freemium',
        });
    }

    temp['attributes'] = await this.rateAttributeRepository.findBy({
      id: In(attributes),
    });

    temp['subjects'] = await this.subjectRepository.findBy({
      id: In(subjects),
    });

    return await this.rateRepository.save({ ...temp, ...rest });
  }

  async findAll(
    rateQueryDto: RateQueryDto,
  ): Promise<IComplexRequest<RateEntity[]>> {
    const { attribute, subject, search, limit, offset, ...filterQuery } =
      rateQueryDto;

    const relationFilterQuery = [];

    if (attribute) {
      relationFilterQuery.push({
        query: 'rate_attribute.id = :id',
        value: { id: attribute },
      });
    }

    if (subject) {
      relationFilterQuery.push({
        query: 'subject.id = :id',
        value: { id: subject },
      });
    }

    return await this.utils.complexRequest<RateEntity>({
      entity: 'rate',
      repository: this.rateRepository,
      relationFilterQuery,
      limit,
      offset,
      search,
      searchFields: ['title', 'description', 'content'],
      relations: [
        { field: 'attributes', entity: 'rate_attribute' },
        { field: 'subjects', entity: 'subject' },
      ],
      filterQuery,
    });
  }

  async findOne(id: number): Promise<RateEntity> {
    const rate = await this.rateRepository.findOneBy({ id });
    if (!rate) throw new NotFoundException('Rate is not not found');
    return rate;
  }

  async update(id: number, updateRateDto: UpdateRateDto) {
    const { attributes, subjects, ...rest } = updateRateDto;

    if (rest?.isFreemium) {
      const rate = await this.rateRepository.findOneBy({
        isFreemium: true,
        id: Not(id),
      });
      if (rate)
        throw new BadRequestException({
          message: 'Only one rate can be freemium',
        });
    }

    const rate = await this.findOne(id);
    const temp = {};
    if (attributes) {
      temp['attributes'] = await this.rateAttributeRepository.findBy({
        id: In(attributes),
      });
    }
    if (subjects) {
      temp['subjects'] = await this.subjectRepository.findBy({
        id: In(subjects),
      });
    }
    return await this.rateRepository.save({ ...rate, ...temp, ...rest });
  }

  async remove(id: number): Promise<void> {
    const rate = await this.findOne(id);
    await rate.remove();
  }
}
