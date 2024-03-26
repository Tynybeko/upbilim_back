import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update.country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from './entities/country.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';
import { RegionEntity } from '../region/entities/region.entity';
import { CountryQueryDto } from './dto/country-query.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    private utils: UtilsService,
  ) { }

  async create(CreateCountryDto: CreateCountryDto): Promise<CountryEntity> {
    const country = this.countryRepository.create(CreateCountryDto);
    return await this.countryRepository.save(country);
  }

  async findAll(
    query: CountryQueryDto,
  ): Promise<IComplexRequest<CountryEntity[]>> {
    const { ...rest } = query;
    const relationFilterQuery = [];
    return await this.utils.complexRequest<CountryEntity>({
      entity: 'country',
      repository: this.countryRepository,
      searchFields: ['label', 'label_kg', 'label_uz', 'label_kz', 'label_en'],
      relationFilterQuery,
      ...rest,
    });
  }

  async createForJSON(data: any[]) {
    if (!Array.isArray(data)) throw new BadRequestException({file: 'Должен быть массив данных!'})
    const uniqueIds = new Set();
    const oldData = await this.findAll({} as CountryQueryDto)
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
      let mykey = ''
      let uniqueData = oldData.data.some(el => {
        for (let key in el) {
          if (key != 'id' && el[key] == item[key]) {
            mykey = key
            return true
          }
        }
      })
      if (uniqueData) throw new BadRequestException({ file: `Дублирующийся элемент с ID: ${item.id} в ${mykey}` });
    }
    for (let item of data) {
      result.push(await this.create(item))
    }
    return result
  }


  async findOne(id: number): Promise<CountryEntity> {
    const district = await this.countryRepository.findOneBy({ id });
    if (!district)
      throw new NotFoundException({ message: 'District not found' });
    return district;
  }

  async update(
    id: number,
    updateCountry: UpdateCountryDto,
  ): Promise<CountryEntity> {
    await this.countryRepository.update({ id }, updateCountry);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const district = await this.findOne(id);
    await district.remove();
  }
}
