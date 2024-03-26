import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictEntity } from './entities/district.entity';
import { UtilsModule } from '../utils/utils.module';
import { RegionEntity } from '../region/entities/region.entity';
import { CountryEntity } from 'src/country/entities/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistrictEntity, RegionEntity, CountryEntity]),
    UtilsModule,
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule { }
