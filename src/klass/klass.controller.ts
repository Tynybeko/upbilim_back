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
import { KlassService } from './klass.service';
import { CreateKlassDto } from './dto/create-klass.dto';
import { UpdateKlassDto } from './dto/update-klass.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { KlassQueryDto } from './dto/klass-query.dto';

@ApiTags('Klass')
@Controller('/klasses')
export class KlassController {
  constructor(private klassService: KlassService) {}

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createKlassDto: CreateKlassDto) {
    return this.klassService.create(createKlassDto);
  }

  @Get()
  findAll(@Query() query: KlassQueryDto) {
    return this.klassService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.klassService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKlassDto: UpdateKlassDto) {
    return this.klassService.update(+id, updateKlassDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.klassService.remove(+id);
  }
}
