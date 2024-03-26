import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionEntity } from './entities/region.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';
import { CountryEntity } from 'src/country/entities/country.entity';
import { RegionQueryDto } from './dto/region-query.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(RegionEntity)
    private regionRepository: Repository<RegionEntity>,
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    private utils: UtilsService,
  ) { }

  async create(createRegionDto: CreateRegionDto): Promise<RegionEntity> {
    const { country, ...rest } = createRegionDto
    const temp = {}
    if (country) {
      temp['country'] = await this.utils.getObjectOr404(
        this.countryRepository,
        { where: { id: country } },
        'Country',
      )
    }
    const region = this.regionRepository.create({ ...temp, ...rest });
    return await this.regionRepository.save(region);
  }

  async findAll(
    query: RegionQueryDto,
  ): Promise<IComplexRequest<RegionEntity[]>> {
    const { country, ...rest } = query;
    const relationFilterQuery = [];
    if (country) {
      relationFilterQuery.push({
        query: 'country.id = :id',
        value: { id: country },
      });
    }

    return await this.utils.complexRequest<RegionEntity>({
      entity: 'region',
      repository: this.regionRepository,
      searchFields: ['label', 'label_kg', 'label_uz', 'label_kz', 'label_en'],
      relationFilterQuery,
      relations: [
        { field: 'country', entity: 'country' },
      ],
      ...rest,
    });
  }

  async findOne(id: number): Promise<RegionEntity> {
    const region = await this.regionRepository.findOneBy({ id });
    if (!region) throw new NotFoundException({ message: 'Region not found' });
    return region;
  }

  async update(
    id: number,
    updateRegionDto: UpdateRegionDto,
  ): Promise<RegionEntity> {
    const { country, ...rest } = updateRegionDto
    const temp = {}
    if (country) {
      temp['country'] = await this.utils.getObjectOr404(
        this.countryRepository,
        { where: { id: country } },
        'Country',
      )
    }
    await this.regionRepository.update({ id }, { ...temp, ...rest });
    return await this.findOne(id);
  }


  async createForJSON(data: any[]) {
    const uniqueIds = new Set();
    const oldData = await this.findAll({} as RegionQueryDto)
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
      await this.utils.getObjectOr404(
        this.countryRepository,
        { where: { id: item.countryId } },
        'Country',
      )
      item['country'] = item.countryId
    }
    for (let item of data) {
      result.push(await this.create(item))
    }
    return result
  }

  async remove(id: number): Promise<void> {
    const region = await this.findOne(id);
    await region.remove();
  }
}
