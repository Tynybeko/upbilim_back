import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from '../dto/student/create-student.dto';
import { StudentEntity } from '../entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../../group/entities/group.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UtilsService } from '../../utils/utils.service';
import { StudentDto } from '../dto/student/student.dto';
import { UserRolesEnum } from '../enums/user-roles.enum';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
    private utils: UtilsService,
  ) {}

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: { user: true, group: true },
    });
    if (!student) throw new NotFoundException({ message: 'Student not found' });
    return student;
  }

  async create(createStudentDto: CreateStudentDto): Promise<StudentEntity> {
    const { group, user } = createStudentDto;
    const userInstance = await this.utils.getObjectOr404<UserEntity>(
      this.userRepository,
      { where: { id: user } },
      'User',
    );

    if (userInstance.role !== UserRolesEnum.USER) {
      throw new BadRequestException({
        user: [`Role should be ${UserRolesEnum.USER}`],
      });
    }

    const student = new StudentEntity();
    student.group = await this.utils.getObjectOr404<GroupEntity>(
      this.groupRepository,
      { where: { id: group } },
      'Group',
    );
    student.user = userInstance;

    return await this.studentRepository.save(student);
  }

  async update(
    id: number,
    updateStudentDto: StudentDto,
  ): Promise<StudentEntity> {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException({ message: 'Student not found' });

    student.group = await this.utils.getObjectOr404<GroupEntity>(
      this.groupRepository,
      { where: { id: updateStudentDto.group } },
      'Group',
    );

    return await this.studentRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException({ message: 'Student not found' });
    await student.remove();
  }
}
