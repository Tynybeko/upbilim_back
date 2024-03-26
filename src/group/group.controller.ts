import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupQueryDto } from './dto/group-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';

@ApiTags('Group')
@Controller('/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) { }



  @ApiOperation({ summary: 'Для создание группы (Учеба, Развлечение)' })
  @ApiResponse({ status: 200, type: CreateGroupDto })
  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }


  @ApiOperation({ summary: 'Для получение групп' })
  @ApiResponse({ status: 200, type: [CreateGroupDto] })
  @Get()
  findAll(@Query() query: GroupQueryDto) {
    return this.groupService.findAll(query);
  }



  @ApiOperation({ summary: 'Для получение группы по ID' })
  @ApiResponse({ status: 200, type: CreateGroupDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }


  @ApiOperation({ summary: 'Для измение группы' })
  @ApiResponse({ status: 200, type: CreateGroupDto })
  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }



  @ApiOperation({ summary: 'Для удаление группы' })
  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}
