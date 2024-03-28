import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRateApplicationDto } from '../dto/rate-application/update-rate-application.dto';
import { RateApplicationQueryDto } from '../dto/rate-application/rate-application-query.dto';
import { CreateRateApplicationDto } from '../dto/rate-application/create-rate-application.dto';
import { UtilsService } from '../../utils/utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RateEntity } from '../entities/rate.entity';
import { RateAppStatusEnum } from '../enums/rate-app-status.enum';
import { RateApplicationEntity } from '../entities/rate-application.entity';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';

@Injectable()
export class RateApplicationService {
  constructor(
    private utils: UtilsService,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(RateEntity)
    private rateService: Repository<RateEntity>,

    @InjectRepository(RateApplicationEntity)
    private rateApplicationRepository: Repository<RateApplicationEntity>,
  ) {}

  async remove(id: number): Promise<void> {
    const rateApplication = await this.findOne(id);
    await rateApplication.remove();
  }

  async update(id: number, updateRateApplicationDto: UpdateRateApplicationDto) {
    const rateApplication = await this.findOne(id);
    return await this.rateApplicationRepository.save({
      ...rateApplication,
      ...updateRateApplicationDto,
    });
  }

  async findOne(id: number): Promise<RateApplicationEntity> {
    const rateApplication = await this.rateApplicationRepository.findOneBy({
      id,
    });
    if (!rateApplication)
      throw new NotFoundException({ message: 'Rate application not found' });
    return rateApplication;
  }

  async findAll(
    rateApplicationQueryDto: RateApplicationQueryDto,
  ): Promise<IComplexRequest<RateApplicationEntity[]>> {
    const { user, rate, limit, offset, ...filterQuery } =
      rateApplicationQueryDto;
    const relationFilterQuery = [];
    if (user) {
      relationFilterQuery.push({
        query: 'user.id = :id',
        value: { id: user },
      });
    }
    if (rate) {
      relationFilterQuery.push({
        query: 'rate.id = :id',
        value: { id: rate },
      });
    }

    return await this.utils.complexRequest<RateApplicationEntity>({
      entity: 'rate-application',
      repository: this.rateApplicationRepository,
      limit,
      offset,
      filterQuery,
      relationFilterQuery,
      relations: [
        { entity: 'user', field: 'user' },
        { entity: 'rate', field: 'rate' },
      ],
    });
  }

  async create(
    createRateApplicationDto: CreateRateApplicationDto,
    userId: number,
  ): Promise<RateApplicationEntity> {
    const { rate, ...rest } = createRateApplicationDto;
    
    const temp = {};
    temp['user'] = await this.utils.getObjectOr404<UserEntity>(
      this.userRepository,
      { where: { id: userId } },
      'User',
    );
    temp['rate'] = await this.utils.getObjectOr404<RateEntity>(
      this.rateService,
      { where: { id: rate } },
      'Rate',
    );
    temp['status'] = RateAppStatusEnum.PENDING;

    const rateApplication = this.rateApplicationRepository.create({
      ...rest,
      ...temp,
    });

    return await this.rateApplicationRepository.save(rateApplication);
  }
}
