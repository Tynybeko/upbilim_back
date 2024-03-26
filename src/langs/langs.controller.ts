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
import { LangService } from './langs.service';
import { CreateLangDto } from './dto/create-langs.dto';
import { UpdateLangDto } from './dto/update.langs.dto';
import { PaginationQueryDto } from '../utils/dto/pagination-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { LangQueryDto } from './dto/langs-query.dto';

@ApiTags('Lang')
@Controller('/lang')
export class LangController {
  constructor(private readonly districtService: LangService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Для создание языка' })
  @ApiResponse({ status: 200, type: CreateLangDto })
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createDistrictDto: CreateLangDto) {
    return this.districtService.create(createDistrictDto);
  }


  @ApiOperation({ summary: 'Для получении всех языков' })
  @ApiResponse({ status: 200, type: [CreateLangDto] })
  @Get()
  findAll(@Query() query: LangQueryDto) {
    return this.districtService.findAll(query);
  }


  @ApiOperation({ summary: 'Для получении языка по ID' })
  @ApiResponse({ status: 200, type: CreateLangDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Для изменени языка' })
  @ApiResponse({ status: 200, type: CreateLangDto })
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateLangDto,
  ) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @ApiOperation({ summary: 'Для удаление языка по ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtService.remove(+id);
  }
}
