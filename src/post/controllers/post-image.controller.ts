import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from '../../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../../auth/guards/role-auth.guard';
import { PostImageService } from '../services/post-image.service';
import { CreatePostImageDto } from '../dto/create-post-image.dto';
import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';

@ApiTags('Post Image')
@Controller('/posts/images/')
export class PostImageController {
  constructor(private readonly postImageService: PostImageService) {}

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post()
  @FormDataRequest()
  create(@Body() createPostImageDto: CreatePostImageDto) {
    return this.postImageService.create(createPostImageDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.postImageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postImageService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postImageService.remove(+id);
  }
}
