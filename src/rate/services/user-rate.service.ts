import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRateDto } from '../dto/user-rate/create-user-rate.dto';
import { UserRateQueryDto } from '../dto/user-rate/user-rate-query.dto';
import { UpdateUserRateDto } from '../dto/user-rate/update-user-rate.dto';
import { UserRateEntity } from '../entities/user-rate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsService } from '../../utils/utils.service';
import { UserEntity } from '../../user/entities/user.entity';
import { RateEntity } from '../entities/rate.entity';
import { RateSystemService } from './rate-system.service';

@Injectable()
export class UserRateService {
  constructor(
    @InjectRepository(UserRateEntity)
    private userRateRepository: Repository<UserRateEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RateEntity)
    private rateRepository: Repository<RateEntity>,

    private utils: UtilsService,
    private rateSystemService: RateSystemService,
  ) {}

  async create(createUserRate: CreateUserRateDto): Promise<UserRateEntity> {
    const { user, rate, ...rest } = createUserRate;
    const temp = {};
    temp['user'] = await this.utils.getObjectOr404<UserEntity>(
      this.userRepository,
      { where: { id: user } },
      'User',
    );

    temp['rate'] = await this.utils.getObjectOr404<RateEntity>(
      this.rateRepository,
      { where: { id: rate } },
      'Rate',
    );
    const userRateTemp = this.userRateRepository.create({ ...temp, ...rest });

    const userRate = await this.userRateRepository.save(userRateTemp);
    await this.rateSystemService.checkUserRateValidity(user);
    return userRate;
  }

  async findAll(userRateQueryDto: UserRateQueryDto) {
    const { user, rate, ...rest } = userRateQueryDto;

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

    return await this.utils.complexRequest<UserRateEntity>({
      entity: 'user_rate',
      repository: this.userRateRepository,
      relationFilterQuery,
      relations: [
        { field: 'user', entity: 'user' },
        { field: 'rate', entity: 'rate' },
      ],
      ...rest,
    });
  }

  async findOne(id: number): Promise<UserRateEntity> {
    const userRate = await this.userRateRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!userRate) {
      throw new NotFoundException({ message: 'User rate is not found' });
    }
    return userRate;
  }

  async update(
    id: number,
    updateUserRateDto: UpdateUserRateDto,
  ): Promise<UserRateEntity> {
    const { user, rate, ...rest } = updateUserRateDto;
    const userRate = await this.userRateRepository.findOneBy({ id });
    if (!userRate) {
      throw new NotFoundException({ message: 'User rate is not found' });
    }
    const temp = {};
    if (user) {
      temp['user'] = await this.utils.getObjectOr404<UserEntity>(
        this.userRepository,
        { where: { id: user } },
        'User',
      );
    }

    if (rate) {
      temp['rate'] = await this.utils.getObjectOr404<RateEntity>(
        this.rateRepository,
        { where: { id: rate } },
        'Rate',
      );
    }
    const updatedUserRate = await this.userRateRepository.save({
      ...userRate,
      ...rest,
      ...temp,
    });
    await this.rateSystemService.checkUserRateValidity(user);
    return updatedUserRate;
  }

  async remove(id: number): Promise<void> {
    const userRate = await this.findOne(id);
    const userId = userRate.user.id;
    await userRate.remove();
    await this.rateSystemService.checkUserRateValidity(userId);
  }

  async currentUserRate(id: number): Promise<UserRateEntity> {
    const userRate = await this.userRateRepository.findOne({
      where: { user: { id } },
      relations: ['user'],
    });
    if (!userRate) {
      throw new NotFoundException({ message: 'User rate is not found' });
    }
    return userRate;
  }
}
