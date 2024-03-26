import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { RegionQueryDto } from './dto/region-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@ApiTags('Region')
@Controller('/regions')
export class RegionController {
  constructor(private readonly regionService: RegionService,
    private fileService: FileService
    
    ) { }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Для создание регионов по JSON' })
  @ApiResponse({ status: 200, type: [CreateRegionDto] })
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post('JSON')
  @UseInterceptors(FileInterceptor('file'))
  async createWithJSON(@UploadedFile() file) {
    const jsonData = await this.fileService.readJSONFile(file);
    return this.regionService.createForJSON(jsonData)
  }


  @Get()
  findAll(@Query() query: RegionQueryDto) {
    return this.regionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(+id);
  }
}
