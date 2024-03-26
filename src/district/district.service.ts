import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DistrictEntity } from './entities/district.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';
import { RegionEntity } from '../region/entities/region.entity';
import { DistrictQueryDto } from './dto/district-query.dto';
import { CountryEntity } from 'src/country/entities/country.entity';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(DistrictEntity)
    private districtRepository: Repository<DistrictEntity>,
    @InjectRepository(RegionEntity)
    private regionRepository: Repository<RegionEntity>,
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    private utils: UtilsService,
  ) { }

  async create(createDistrictDto: CreateDistrictDto): Promise<DistrictEntity> {
    const { region, country, ...rest } = createDistrictDto;
    const temp = {}

    if (region) {
      temp['region'] = await this.utils.getObjectOr404(
        this.regionRepository,
        { where: { id: region } },
        'Region',
      )
    }

    if (country) {
      temp['country'] = await this.utils.getObjectOr404(
        this.countryRepository,
        { where: { id: country } },
        'Country',
      )
    }
    const district = this.districtRepository.create({ ...rest, ...temp });
    return await this.districtRepository.save(district);
  }

  async findAll(
    query: DistrictQueryDto,
  ): Promise<IComplexRequest<DistrictEntity[]>> {
    const { region, country, ...rest } = query;
    const relationFilterQuery = [];
    if (region) {
      relationFilterQuery.push({
        query: 'region.id = :id',
        value: { id: region },
      });
    }
    if (country) {
      relationFilterQuery.push({
        query: 'country.id = :id',
        value: { id: country },
      });
    }
    return await this.utils.complexRequest<DistrictEntity>({
      entity: 'district',
      repository: this.districtRepository,
      searchFields: ['label', 'label_kg', 'label_uz', 'label_kz', 'label_en'],
      relationFilterQuery,
      relations: [
        { field: 'region', entity: 'region' },
        { field: 'country', entity: 'country' },
      ],
      ...rest,
    });
  }

  async createForJSON(data: any[]) {
    const uniqueIds = new Set();
    const oldData = await this.findAll({} as DistrictQueryDto)
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

      await this.utils.getObjectOr404(
        this.regionRepository,
        { where: { id: item.regionId } },
        'Country',
      )
      item['region'] = item.regionId

    }
    for (let item of data) {
      result.push(await this.create(item))
    }
    return result
  }

  async findOne(id: number): Promise<DistrictEntity> {
    const district = await this.districtRepository.findOneBy({ id });
    if (!district)
      throw new NotFoundException({ message: 'District not found' });
    return district;
  }

  async update(
    id: number,
    updateDistrictDto: UpdateDistrictDto,
  ): Promise<DistrictEntity> {
    const { region, country, ...rest } = updateDistrictDto;
    const temp = {};
    if (region) {
      temp['region'] = await this.utils.getObjectOr404(
        this.regionRepository,
        { where: { id: region } },
        'Region',
      );
    }
    if (country) {
      temp['country'] = await this.utils.getObjectOr404(
        this.countryRepository,
        { where: { id: country } },
        'Country',
      );
    }
    await this.districtRepository.update({ id }, { ...rest, ...temp });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const district = await this.findOne(id);
    await district.remove();
  }
}
