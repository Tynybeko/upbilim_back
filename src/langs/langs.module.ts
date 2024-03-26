import { Module } from '@nestjs/common';
import { LangService } from './langs.service';
import { LangController } from './langs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LangEntity } from './entities/langs.entity';
import { UtilsModule } from '../utils/utils.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LangEntity]),
    UtilsModule,
    FileModule
  ],
  controllers: [LangController],
  providers: [LangService],
})
export class LangModule { }
