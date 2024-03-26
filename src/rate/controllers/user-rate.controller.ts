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
import { UserRateService } from '../services/user-rate.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../../auth/guards/role-auth.guard';
import { CreateUserRateDto } from '../dto/user-rate/create-user-rate.dto';
import { UserRateQueryDto } from '../dto/user-rate/user-rate-query.dto';
import { UpdateUserRateDto } from '../dto/user-rate/update-user-rate.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('User Rate')
@Controller('/user-rates')
export class UserRateController {
  constructor(private userRateService: UserRateService) {}

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createUserRate: CreateUserRateDto) {
    return this.userRateService.create(createUserRate);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Get()
  findAll(@Query() userRateQueryDto: UserRateQueryDto) {
    return this.userRateService.findAll(userRateQueryDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/current-user-rate')
  currentUserRate(@User() user: UserEntity) {
    return this.userRateService.currentUserRate(user.id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRateService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserRateDto: UpdateUserRateDto,
  ) {
    return this.userRateService.update(+id, updateUserRateDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRateService.remove(+id);
  }
}
