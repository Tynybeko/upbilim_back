import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './entities/country.entity';
import { UtilsModule } from '../utils/utils.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity]),
    UtilsModule,
    FileModule
  ],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule { }
