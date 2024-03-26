import { UserRolesEnum } from './../user/enums/user-roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update.country.dto';
import { PaginationQueryDto } from '../utils/dto/pagination-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { CountryQueryDto } from './dto/country-query.dto';
import { FileService } from 'src/file/file.service';

@ApiTags('Country')
@Controller('/country')
export class CountryController {
  constructor(private readonly countryService: CountryService,
    private readonly fileService: FileService
  ) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Для создание стран' })
  @ApiResponse({ status: 200, type: CreateCountryDto })
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createDistrictDto: CreateCountryDto) {
    return this.countryService.create(createDistrictDto);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Для создание стран по JSON' })
  @ApiResponse({ status: 200, type: CreateCountryDto })
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post('JSON')
  @UseInterceptors(FileInterceptor('file'))
  async createWithJSON(@UploadedFile() file) {
    const jsonData = await this.fileService.readJSONFile(file);
    return this.countryService.createForJSON(jsonData)
  }

  @ApiOperation({ summary: 'Для получении всех стран' })
  @ApiResponse({ status: 200, type: [CreateCountryDto] })
  @Get()
  findAll(@Query() query: CountryQueryDto) {
    return this.countryService.findAll(query);
  }


  @ApiOperation({ summary: 'Для получении страны по ID' })
  @ApiResponse({ status: 200, type: CreateCountryDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Для изменени страны' })
  @ApiResponse({ status: 200, type: CreateCountryDto })
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateCountryDto,
  ) {
    return this.countryService.update(+id, updateDistrictDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @ApiOperation({ summary: 'Для удаление страны по ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countryService.remove(+id);
  }
}
