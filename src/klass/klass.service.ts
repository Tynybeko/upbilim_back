import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateKlassDto } from './dto/create-klass.dto';
import { UpdateKlassDto } from './dto/update-klass.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { KlassEntity } from './entities/klass.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';
import { KlassQueryDto } from './dto/klass-query.dto';

@Injectable()
export class KlassService {
  constructor(
    @InjectRepository(KlassEntity)
    private klassRepository: Repository<KlassEntity>,
    private utils: UtilsService,
  ) { }

  async create(createKlassDto: CreateKlassDto): Promise<KlassEntity> {
    const klass = this.klassRepository.create(createKlassDto);
    return await this.klassRepository.save(klass);
  }

  async findAll(query: KlassQueryDto): Promise<IComplexRequest<KlassEntity[]>> {
    const { search, limit, offset } = query;

    return await this.utils.complexRequest<KlassEntity>({
      entity: 'klass',
      repository: this.klassRepository,
      limit,
      offset,
      search,
      searchFields: ['title', 'title_kg'],
    });
  }

  async findOne(id: number): Promise<KlassEntity> {
    const klass = await this.klassRepository.findOneBy({ id });
    if (!klass) throw new NotFoundException({ message: 'Klass not found' });
    return klass;
  }

  async createForJSON(data: any[]) {
    if (!Array.isArray(data)) throw new BadRequestException({ file: 'Должен быть массив данных!' })
    const uniqueIds = new Set();
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
    }
    for (let item of data) {
      result.push(await this.create(item))
    }
    return result
  }


  async update(
    id: number,
    updateKlassDto: UpdateKlassDto,
  ): Promise<KlassEntity> {
    await this.klassRepository.update({ id }, updateKlassDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const klass = await this.findOne(id);
    await klass.remove();
  }
}
