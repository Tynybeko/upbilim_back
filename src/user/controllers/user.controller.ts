import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserRolesEnum } from '../enums/user-roles.enum';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserQueryDto } from '../dto/user/user-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { RoleAuthGuard } from '../../auth/guards/role-auth.guard';
import { Roles } from '../../auth/decorators/roles-auth.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('/users')
export class UserController {
  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/passed-quizzers')
  passedQuizzers(@Query() query: PaginationQueryDto, @Req() req) {
    return this.userService.passedQuizzers(+req.user.id, query);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN, UserRolesEnum.MANAGER)
  @UseGuards(RoleAuthGuard)
  @Get('/passed-quizzers/:id')
  async passedQuizzersAsAdmin(
    @Query() query: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    const user = await this.userService.findOne(+id);
    return this.userService.passedQuizzers(user.id, query);
  }

  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Get()
  findAll(
    @Query() queryDto: UserQueryDto,
  ): Promise<IComplexRequest<UserEntity[]>> {
    return this.userService.findAll(queryDto);
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(
    @Body() dto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 6000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File = null,
  ): Promise<UserEntity> {
    return this.userService.create(dto, avatar);
  }

  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: number): Promise<UserEntity> {
    const user = this.userService.findOne(+id);
    if (!user) throw new NotFoundException({ message: 'User not found' });
    return user;
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Patch('/:id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 6000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File = null,
  ): Promise<UserEntity> {
    return this.userService.update(+id, dto, avatar);
  }

  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.userService.remove(+id);
  }
}
