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
import { MailingService } from './mailing.service';
import { CreateMailingDto } from './dto/create-mailing.dto';
import { UpdateMailingDto } from './dto/update-mailing.dto';
import { PaginationQueryDto } from '../utils/dto/pagination-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';

@ApiTags('Mailing')
@Controller('/mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post()
  create(@Body() createMailingDto: CreateMailingDto) {
    return this.mailingService.create(createMailingDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Post('/share-post/:id')
  sharePost(@Param('id') id: string) {
    return this.mailingService.sharePost(+id);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.mailingService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailingService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMailingDto: UpdateMailingDto) {
    return this.mailingService.update(+id, updateMailingDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailingService.remove(+id);
  }
}
