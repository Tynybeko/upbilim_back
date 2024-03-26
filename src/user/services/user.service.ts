import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/user/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { FileService } from '../../file/file.service';
import { UserQueryDto } from '../dto/user/user-query.dto';
import { UtilsService } from 'src/utils/utils.service';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { Repository } from 'typeorm';
import { ParticipantEntity } from '../../testing/entities/participant.entity';
import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';
import { TestingStatusEnum } from '../../testing/enum/testing-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ParticipantEntity)
    private participantRepository: Repository<ParticipantEntity>,
    private filesService: FileService,
    private utils: UtilsService,
  ) { }

  async findAll(
    queryDto: UserQueryDto,
    orderBy = 'id',
    order: 'DESC' | 'ASC' = 'DESC',
  ): Promise<IComplexRequest<UserEntity[]>> {
    const { limit, offset, search, ...rest } = queryDto;
    return await this.utils.complexRequest<UserEntity>({
      entity: 'user',
      repository: this.userRepository,
      limit,
      offset,
      filterQuery: rest,
      search,
      orderBy,
      order,
      searchFields: ['first_name', 'last_name', 'email', 'phone'],
    });
  }

  async create(
    dto: CreateUserDto,
    avatar: Express.Multer.File = null,
  ): Promise<UserEntity> {
    let avatarPath: string | null = null;
    if (avatar) {
      avatarPath = await this.filesService.createFile('user_avatars', avatar);
    }
    const hashPassword = await this.makePassword(dto.password);
    const user = await this.userRepository.create({
      ...dto,
      avatar: avatarPath,
      password: hashPassword,
    });
    await this.userRepository.save(user);
    return user;
  }

  async makePassword(password: string): Promise<string> {
    return await bcryptjs.hash(password, 10);
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException({ message: 'User not found' });
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user.avatar) this.filesService.removeFile(user.avatar, false);
    await user.remove();
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    avatar: Express.Multer.File = null,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException({ message: 'User not found' });
    const temp = {};
    if (avatar) {
      if (user.avatar) this.filesService.removeFile(user.avatar, false);
      temp['avatar'] = await this.filesService.createFile(
        'user_avatars',
        avatar,
      );
    }
    if (dto.password) {
      temp['password'] = await this.makePassword(dto.password);
    }
    await this.userRepository.update({ id }, { ...dto, ...temp });

    return await this.findOne(id);
  }

  async findOneWithPassword(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'username',
        'password',
        'id',
        'role',
        'avatar',
        'phone',
        'email',
        'firstName',
        'lastName',
      ],
    });
    if (!user) throw new NotFoundException({ message: 'User not found' });
    return user;
  }

  async getByUsernameWithPassword(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'username',
        'password',
        'id',
        'role',
        'avatar',
        'phone',
        'email',
        'firstName',
        'lastName',
        'isActive',
      ],
    });

    if (!user)
      throw new NotFoundException({
        message: ['Не существует пользователя или неверный пароль'],
      });
    return user;
  }

  async passedQuizzers(id: number, query: PaginationQueryDto) {
    const queryBuilder =
      this.participantRepository.createQueryBuilder('participant');

    queryBuilder.leftJoinAndSelect('participant.testing', 'testing');
    queryBuilder.where({
      user: { id },
      testing: { status: TestingStatusEnum.FINISHED },
    });

    const take = query.limit || 20;
    const page = query.offset || 1;
    const skip = (page - 1) * take;

    queryBuilder.take(take).skip(skip);

    const totalCount = await queryBuilder.getCount();

    const results = await queryBuilder.getMany();

    return {
      totalCount,
      offset: page,
      limit: take,
      totalPages: Math.ceil(totalCount / take) ?? 0,
      data: results,
    };
  }
}
