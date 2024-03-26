import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../../auth/guards/role-auth.guard';
import { RateAttributeService } from '../services/rate-attribute.service';
import { RateAttributeDto } from '../dto/rate-attribute/rate-attribute.dto';
import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';

@ApiTags('Rate Attributes')
@Controller('/rate-attributes')
export class RateAttributesController {
  constructor(private readonly rateAttributeService: RateAttributeService) {}

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createRateAttributeDto: RateAttributeDto) {
    return this.rateAttributeService.create(createRateAttributeDto);
  }

  @Get()
  findAll(@Query() rateAttributeQueryDto: PaginationQueryDto) {
    return this.rateAttributeService.findAll(rateAttributeQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateAttributeService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRateAttributeDto: RateAttributeDto,
  ) {
    return this.rateAttributeService.update(+id, updateRateAttributeDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateAttributeService.remove(+id);
  }
}
