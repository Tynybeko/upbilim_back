import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import { CreateTeacherDto } from '../dto/teacher/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/teacher/update-teacher.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../enums/user-roles.enum';
import { RoleAuthGuard } from '../../auth/guards/role-auth.guard';
import { IsTeacherGuard } from '../guards/is-teacher.guard';

@ApiTags('Teacher')
@Controller('/teachers')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post('/create-as-admin')
  createAsAdmin(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.TEACHER)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createTeacherDto: UpdateTeacherDto, @Req() req) {
    return this.teacherService.create({
      ...createTeacherDto,
      user: req.user.id,
    });
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.TEACHER)
  @UseGuards(RoleAuthGuard)
  @UseGuards(IsTeacherGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(+id, updateTeacherDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.TEACHER)
  @UseGuards(RoleAuthGuard)
  @UseGuards(IsTeacherGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }
}
