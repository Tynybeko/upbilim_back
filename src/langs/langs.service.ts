import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLangDto } from './dto/create-langs.dto';
import { UpdateLangDto } from './dto/update.langs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LangEntity } from './entities/langs.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';
import { LangQueryDto } from './dto/langs-query.dto';

@Injectable()
export class LangService {
  constructor(
    @InjectRepository(LangEntity)
    private countryRepository: Repository<LangEntity>,
    private utils: UtilsService,
  ) { }

  async create(CreateLangDto: CreateLangDto): Promise<LangEntity> {
    const country = this.countryRepository.create(CreateLangDto);
    return await this.countryRepository.save(country);
  }

  async findAll(
    query: LangQueryDto,
  ): Promise<IComplexRequest<LangEntity[]>> {
    const { ...rest } = query;
    const relationFilterQuery = [];
    return await this.utils.complexRequest<LangEntity>({
      entity: 'district',
      repository: this.countryRepository,
      searchFields: ['label', 'label_kg', 'label_uz', 'label_kz', 'label_en'],
      relationFilterQuery,
      relations: [{ field: 'region', entity: 'region' }],
      ...rest,
    });
  }

  async findOne(id: number): Promise<LangEntity> {
    const district = await this.countryRepository.findOneBy({ id });
    if (!district)
      throw new NotFoundException({ message: 'District not found' });
    return district;
  }

  async update(
    id: number,
    updateCountry: UpdateLangDto,
  ): Promise<LangEntity> {
    await this.countryRepository.update({ id }, updateCountry);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const district = await this.findOne(id);
    await district.remove();
  }
}
