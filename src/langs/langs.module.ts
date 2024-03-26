import { Module } from '@nestjs/common';
import { LangService } from './langs.service';
import { LangController } from './langs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LangEntity } from './entities/langs.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LangEntity]),
    UtilsModule,
  ],
  controllers: [LangController],
  providers: [LangService],
})
export class LangModule { }
