import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { Repository } from 'typeorm';
import { GroupQueryDto } from './dto/group-query.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilsService } from '../utils/utils.service';
import { SchoolEntity } from '../school/entities/school.entity';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,

    @InjectRepository(SchoolEntity)
    private schoolRepository: Repository<SchoolEntity>,

    private utils: UtilsService,
  ) { }

  // async validateCreation(dto: CreateGroupDto): Promise<boolean> {
  //   const { title, school } = dto;

  //   const group = await this.groupRepository.findOne({
  //     where: { title, school: { id: school } },
  //     relations: { school: true },
  //   });
  //   if (group) {
  //     throw new BadRequestException({
  //       title: ['This title is already exist'],
  //     });
  //   }
  //   return true;
  // }

  // async validateUpdating(dto: UpdateGroupDto, id: number): Promise<boolean> {
  //   const { title, school } = dto;
  //   if (title && school) {
  //     const group = await this.groupRepository.findOne({
  //       where: { title, school: { id: school } },
  //       relations: { school: true },
  //     });
  //     if (group && group.id !== id) {
  //       throw new BadRequestException({
  //         title: ['This title is already exist'],
  //       });
  //     }
  //   }
  //   return true;
  // }


  async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {
    const group = this.groupRepository.create(createGroupDto)
    return await this.groupRepository.save(group);
  }

  async findAll(query: GroupQueryDto): Promise<IComplexRequest<GroupEntity[]>> {
    const relationFilterQuery = [];

    return await this.utils.complexRequest<GroupEntity>({
      entity: 'group',
      repository: this.groupRepository,
      relationFilterQuery,
      searchFields: ['label', 'label_kg', 'label_uz', 'label_kz', 'label_en'],
      ...query,
    });
  }

  async findOne(id: number): Promise<GroupEntity> {
    const group = await this.groupRepository.findOneBy({ id });
    if (!group) throw new NotFoundException({ message: 'Group not found' });
    return group;
  }

  async update(
    id: number,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    await this.groupRepository.update({ id }, updateGroupDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const group = await this.findOne(id);
    await group.remove();
  }
}
