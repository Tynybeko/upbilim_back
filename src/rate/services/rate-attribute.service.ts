import { Injectable, NotFoundException } from '@nestjs/common';
import { RateAttributeDto } from '../dto/rate-attribute/rate-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RateAttributeEntity } from '../entities/rate-attribute.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../../utils/utils.service';
import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';

@Injectable()
export class RateAttributeService {
  constructor(
    @InjectRepository(RateAttributeEntity)
    private rateAttributeRepository: Repository<RateAttributeEntity>,
    private utils: UtilsService,
  ) {}

  async create(createRateDto: RateAttributeDto): Promise<RateAttributeEntity> {
    const rateAttribute = this.rateAttributeRepository.create(createRateDto);
    return await this.rateAttributeRepository.save(rateAttribute);
  }

  async findAll(
    rateQueryDto: PaginationQueryDto,
  ): Promise<IComplexRequest<RateAttributeEntity[]>> {
    return await this.utils.complexRequest<RateAttributeEntity>({
      entity: 'rate_attribute',
      repository: this.rateAttributeRepository,
      ...rateQueryDto,
    });
  }

  async findOne(id: number) {
    const rateAttribute = await this.rateAttributeRepository.findOneBy({ id });
    if (!rateAttribute)
      throw new NotFoundException({ message: 'Rate attribute not found' });
    return rateAttribute;
  }

  async update(
    id: number,
    updateRateDto: RateAttributeDto,
  ): Promise<RateAttributeEntity> {
    await this.rateAttributeRepository.update({ id }, updateRateDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const rateAttribute = await this.findOne(id);
    await rateAttribute.remove();
  }
}
