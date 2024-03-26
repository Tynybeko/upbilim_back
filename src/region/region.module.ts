import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from './entities/region.entity';
import { UtilsModule } from '../utils/utils.module';
import { CountryEntity } from 'src/country/entities/country.entity';
import { FileModule } from 'src/file/file.module';


@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity, CountryEntity]), UtilsModule, FileModule],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
