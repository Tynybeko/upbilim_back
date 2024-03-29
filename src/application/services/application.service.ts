import { ForbiddenException, Injectable } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { CreateTeacherApplicationDto, UpdateTeacherApplicationDto } from '../dto/teacher-application.dto';
import { TeachApplicationEntity } from '../entities/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsService } from 'src/utils/utils.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { SchoolEntity } from 'src/school/entities/school.entity';
import { TeacherQueryDto } from '../dto/query/teacher-query.dto';
import { UserRolesEnum } from 'src/user/enums/user-roles.enum';

@Injectable()
export class ApplicationService {
    constructor(private readonly fileService: FileService,
        @InjectRepository(TeachApplicationEntity)
        private teacherAppRepository: Repository<TeachApplicationEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(SchoolEntity)
        private schoolRepository: Repository<SchoolEntity>,
        private utils: UtilsService
    ) { }


    async teacherCreate(dto: CreateTeacherApplicationDto) {
        const { document, user, school, ...rest } = dto
        const temp = {}
        temp['document'] = await this.fileService.createFile('documents', document)
        temp['user'] = await this.utils.getObjectOr404<UserEntity>(
            this.userRepository,
            {
                where:
                    { id: user }
            },
            'User',
        )
        temp['school'] = await this.utils.getObjectOr404<SchoolEntity>(
            this.schoolRepository,
            {
                where:
                    { id: school }
            },
            'School',
        )
        const application = await this.teacherAppRepository.create({ ...rest, ...temp })
        return await this.teacherAppRepository.save(application)
    }


    async teacherUpdate(dto: UpdateTeacherApplicationDto) {
        const myApplication = await this.utils.getObjectOr404<TeachApplicationEntity>(this.teacherAppRepository, {
            where: {
                id: dto.applicaion
            },
        }, 'User')
        myApplication.status = dto.status
        const user = await this.userRepository.findOne({where: {id: myApplication.user.id}})
        if (user) {
            user.role = UserRolesEnum.TEACHER
            this.userRepository.save(user)
        }
        await this.teacherAppRepository.save(myApplication)
        return await this.getOneTeacherApplicationsWithId(myApplication.id)
    }

    async getAllTeacherApplications(query: TeacherQueryDto, myUser?: UserEntity) {
        const { user, school, offset, limit, ...filterQuery } = query
        const relationFilterQuery = []
        if (user) {
            relationFilterQuery.push({
                query: 'user.id = :id',
                value: { id: user },
            });
        }
        if (school) {
            relationFilterQuery.push({
                query: 'school.id = :id',
                value: { id: school },
            });
        }
        const data = await this.utils.complexRequest<TeachApplicationEntity>({
            entity: 'application_teacher',
            repository: this.teacherAppRepository,
            filterQuery,
            offset,
            limit,
            relationFilterQuery,
            relations: [
                { entity: 'school', field: 'school' },
                { entity: 'user', field: 'user' },
            ],
        });
        return data
    }


    async getMyApplicationTeacher(user: UserEntity) {

        const relationFilterQuery = []
        if (user) {
            relationFilterQuery.push({
                query: 'user.id = :id',
                value: { id: user.id },
            });
        }
        const res = await this.utils.complexRequest<TeachApplicationEntity>({
            entity: 'application_teacher',
            repository: this.teacherAppRepository,
            relationFilterQuery,
            relations: [
                { entity: 'school', field: 'school' },
                { entity: 'user', field: 'user' },
            ],
        });
        const { data } = res
        return data
    }

    async getOneTeacherApplicationsWithId(id: number, user?: UserEntity) {
        const myApp = await this.teacherAppRepository.findOne({ where: { id }, relations: ['user', 'school'] })
        return myApp
    }
}
