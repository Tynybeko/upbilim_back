import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { UtilsService } from '../utils/utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolEntity } from './entities/school.entity';
import { DistrictEntity } from '../district/entities/district.entity';
import { Repository } from 'typeorm';
import { SchoolQueryDto } from './dto/school-query.dto';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(SchoolEntity)
    private schoolRepository: Repository<SchoolEntity>,
    @InjectRepository(DistrictEntity)
    private districtRepository: Repository<DistrictEntity>,
    private utils: UtilsService,
  ) { }

  async create(createSchoolDto: CreateSchoolDto): Promise<SchoolEntity> {
    const { district, ...rest } = createSchoolDto;
    const temp = {};

    const myDistrict = await this.utils.getObjectOr404<DistrictEntity>(
      this.districtRepository,
      { where: { id: district } },
      'district',
    );
    temp['district'] = myDistrict
    temp['country'] = myDistrict.country
    temp['region'] = myDistrict.region
    return await this.schoolRepository.save({ ...rest, ...temp });
  }

  async findAll(
    query: SchoolQueryDto,
  ): Promise<IComplexRequest<SchoolEntity[]>> {
    const { search, district, region, country, offset, limit } = query;
    const relationFilterQuery = [];

    if (district) {
      relationFilterQuery.push({
        query: 'district.id = :id',
        value: { id: district },
      });
    }
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

    
    return await this.utils.complexRequest<SchoolEntity>({
      entity: 'school',
      repository: this.schoolRepository,
      search,
      searchFields: ['title', 'description', 'content', 'link'],
      limit,
      offset,
      relationFilterQuery,
      relations: [{ field: 'district', entity: 'district' }],
    });
  }

  async findOne(id: number): Promise<SchoolEntity> {
    const school = await this.schoolRepository.findOneBy({ id });
    if (!school) throw new NotFoundException({ message: 'School not found' });
    return school;
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto) {
    const { district, ...rest } = updateSchoolDto;

    const temp = {};

    if (district) {
      temp['district'] = await this.utils.getObjectOr404(
        this.districtRepository,
        {
          where: { id: district },
        },
        'district',
      );
    }

    await this.schoolRepository.update({ id }, { ...temp, ...rest });

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const school = await this.findOne(id);
    await school.remove();
  }
}
