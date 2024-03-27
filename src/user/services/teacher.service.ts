import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from '../dto/teacher/create-teacher.dto';
import { TeacherEntity } from '../entities/teacher.entity';
import { UtilsService } from '../../utils/utils.service';
import { SchoolEntity } from '../../school/entities/school.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UpdateTeacherDto } from '../dto/teacher/update-teacher.dto';
import { UserRolesEnum } from '../enums/user-roles.enum';
import { DistrictEntity } from 'src/district/entities/district.entity';

@Injectable()
export class TeacherService {
  constructor(
    private utils: UtilsService,
    @InjectRepository(SchoolEntity)
    private schoolRepository: Repository<SchoolEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TeacherEntity)
    private teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(DistrictEntity)
    private districtRepository: Repository<DistrictEntity>,
  ) { }

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherEntity> {
    const { school,  user } = createTeacherDto;
    const userInstance = await this.utils.getObjectOr404<UserEntity>(
      this.userRepository,
      { where: { id: user } },
      'User',
    );

    if (userInstance.role !== UserRolesEnum.TEACHER) {
      throw new BadRequestException({
        user: [`Role should be ${UserRolesEnum.TEACHER}`],
      });
    }

    const teacher = new TeacherEntity();
    teacher.school = await this.utils.getObjectOr404<SchoolEntity>(
      this.schoolRepository,
      { where: { id: school } },
      'School',
    );
    
    teacher.user = userInstance;

    return await this.teacherRepository.save(teacher);
  }

  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherEntity> {
    const teacher = await this.teacherRepository.findOneBy({ id });
    if (!teacher) throw new NotFoundException({ message: 'Teacher not found' });
    teacher.school = await this.utils.getObjectOr404<SchoolEntity>(
      this.schoolRepository,
      { where: { id: updateTeacherDto.school } },
      'School',
    );
    return await this.teacherRepository.save(teacher);
  }

  async remove(id: number): Promise<void> {
    const teacher = await this.teacherRepository.findOneBy({ id });
    if (!teacher) throw new NotFoundException({ message: 'Teacher not found' });
    await teacher.remove();
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOneBy({ id });
    if (!teacher) throw new NotFoundException({ message: 'Teacher not found' });
    return teacher;
  }
}
