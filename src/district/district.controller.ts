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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { PaginationQueryDto } from '../utils/dto/pagination-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { DistrictQueryDto } from './dto/district-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@ApiTags('District')
@Controller('/districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService,
    private fileService: FileService) { }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create(createDistrictDto);
  }

  @Get()
  findAll(@Query() query: DistrictQueryDto) {
    return this.districtService.findAll(query);
  }



  @ApiBearerAuth()
  @ApiOperation({ summary: 'Для создание районов по JSON' })
  @ApiResponse({ status: 200, type: [CreateDistrictDto] })
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post('JSON')
  @UseInterceptors(FileInterceptor('file'))
  async createWithJSON(@UploadedFile() file) {
    const jsonData = await this.fileService.readJSONFile(file);
    return this.districtService.createForJSON(jsonData)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtService.remove(+id);
  }
}
