import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateStudentDto } from '../dto/student/create-student.dto';
import { StudentDto } from '../dto/student/student.dto';
import { StudentService } from '../services/student.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../enums/user-roles.enum';
import { RoleAuthGuard } from '../../auth/guards/role-auth.guard';
import { IsStudentGuard } from '../guards/is-student.guard';

@ApiTags('Student')
@Controller('/students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post('/create-as-admin')
  createAsAdmin(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.USER)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createStudentDto: StudentDto, @Req() req) {
    return this.studentService.create({
      user: req.user.id,
      ...createStudentDto,
    });
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.USER)
  @UseGuards(RoleAuthGuard)
  @UseGuards(IsStudentGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: StudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.USER)
  @UseGuards(RoleAuthGuard)
  @UseGuards(IsStudentGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
