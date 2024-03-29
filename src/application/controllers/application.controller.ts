import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ApplicationService } from '../services/application.service';
import { CreateTeacherApplicationDto, UpdateTeacherApplicationDto } from '../dto/teacher-application.dto';
import { CreateUserDto } from 'src/user/dto/user/create-user.dto';
import { CreateSchoolDto } from 'src/school/dto/create-school.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from 'src/user/enums/user-roles.enum';
import { RoleAuthGuard } from 'src/auth/guards/role-auth.guard';
import { TeacherQueryDto } from '../dto/query/teacher-query.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';




const TeacherResponse = {
    properties: {
        content: {
            type: 'string', // Тип свойства token
            example: 'content', // Пример значения токена
        },
        document: {
            type: 'string', // Тип свойства token
            example: 'null | img', // Пример значения токена
        },
        user: {
            $ref: getSchemaPath(CreateUserDto),
        },
        school: {
            $ref: getSchemaPath(CreateSchoolDto),
        }

    },
};
@ApiTags('Applications/Заявки')
@Controller('application')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Для заявки на учителя!' })
    @ApiResponse({ status: 200, schema: TeacherResponse })
    @Post('/teacher')
    @FormDataRequest()
    createTeacherApplication(@Body() dto: CreateTeacherApplicationDto) {
        return this.applicationService.teacherCreate(dto)
    }




    @ApiBearerAuth()
    @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @ApiOperation({ summary: 'Для получении всех заявок!' })
    @ApiResponse({ status: 200, schema: TeacherResponse })
    @Get('/teacher')
    getAllTeacherApplication(@Query() query: TeacherQueryDto) {
        return this.applicationService.getAllTeacherApplications(query)
    }


    @ApiBearerAuth()
    @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @ApiOperation({ summary: 'Для получении заявки на учителя по ID' })
    @ApiResponse({ status: 200, schema: TeacherResponse })
    @Get('/teacher/:id')
    getOneTeacherApplication(@Param('id') id: number, @User() user: UserEntity) {
        return this.applicationService.getOneTeacherApplicationsWithId(id, user)
    }





    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Проверка заявки учителя!' })
    @ApiResponse({ status: 200, schema: TeacherResponse })
    @Get('/me')
    async getMyTeacherApplication(@User() user: UserEntity) {
        const data = await this.applicationService.getMyApplicationTeacher(user)
        return {
            teacher: data
        }
    }



    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Для заявки на учителя!' })
    @ApiResponse({ status: 200, schema: TeacherResponse })
    @Patch('/teacher')
    @FormDataRequest()
    updateTeacherApplication(@Body() dto: UpdateTeacherApplicationDto) {
        return this.applicationService.teacherUpdate(dto)
    }



}
