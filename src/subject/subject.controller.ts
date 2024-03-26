import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { PaginationQueryDto } from '../utils/dto/pagination-query.dto';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserEntity } from '../user/entities/user.entity';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('Subject')
@Controller('/subjects')
export class SubjectController {
  constructor(private categoryService: SubjectService) {}

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateSubjectDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.categoryService.findAll(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/with-count-quizzers')
  findAllWithCountQuizzers(@User() user: UserEntity) {
    return this.categoryService.findAllWithCountQuizzers(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateSubjectDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
