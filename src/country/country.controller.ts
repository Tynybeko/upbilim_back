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
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update.country.dto';
import { PaginationQueryDto } from '../utils/dto/pagination-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { CountryQueryDto } from './dto/country-query.dto';

@ApiTags('Country')
@Controller('/country')
export class CountryController {
  constructor(private readonly districtService: CountryService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Для создание стран' })
  @ApiResponse({ status: 200, type: CreateCountryDto })
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Post()
  create(@Body() createDistrictDto: CreateCountryDto) {
    return this.districtService.create(createDistrictDto);
  }


  @ApiOperation({ summary: 'Для получении всех стран' })
  @ApiResponse({ status: 200, type: [CreateCountryDto] })
  @Get()
  findAll(@Query() query: CountryQueryDto) {
    return this.districtService.findAll(query);
  }


  @ApiOperation({ summary: 'Для получении страны по ID' })
  @ApiResponse({ status: 200, type: CreateCountryDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
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
    return this.districtService.update(+id, updateDistrictDto);
  }

  @ApiBearerAuth()
  @Roles(UserRolesEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @ApiOperation({ summary: 'Для удаление страны по ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtService.remove(+id);
  }
}
