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
import { RateApplicationService } from '../services/rate-application.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRateApplicationDto } from '../dto/rate-application/create-rate-application.dto';
import { UpdateRateApplicationDto } from '../dto/rate-application/update-rate-application.dto';
import { RateApplicationQueryDto } from '../dto/rate-application/rate-application-query.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { UserEntity } from '../../user/entities/user.entity';

@ApiTags('Rate Application')
@Controller('/rate-applications')
export class RateApplicationController {
  constructor(private rateApplicationService: RateApplicationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createRateApplicationDto: CreateRateApplicationDto,
    @User() user: UserEntity,
  ) {
    return this.rateApplicationService.create(
      createRateApplicationDto,
      user.id,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Get()
  findAll(@Query() rateApplicationQueryDto: RateApplicationQueryDto) {
    return this.rateApplicationService.findAll(rateApplicationQueryDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateApplicationService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRateApplicationDto: UpdateRateApplicationDto,
  ) {
    return this.rateApplicationService.update(+id, updateRateApplicationDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateApplicationService.remove(+id);
  }
}
