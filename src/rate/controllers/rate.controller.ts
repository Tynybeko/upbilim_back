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
import { RateService } from '../services/rate.service';
import { CreateRateDto } from '../dto/rate/create-rate.dto';
import { UpdateRateDto } from '../dto/rate/update-rate.dto';
import { RateQueryDto } from '../dto/rate/rate-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../../auth/guards/role-auth.guard';

@ApiTags('Rate')
@Controller('/rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createRateDto: CreateRateDto) {
    return this.rateService.create(createRateDto);
  }

  @Get()
  findAll(@Query() rateQueryDto: RateQueryDto) {
    return this.rateService.findAll(rateQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    return this.rateService.update(+id, updateRateDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateService.remove(+id);
  }
}
