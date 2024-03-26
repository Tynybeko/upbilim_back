import { Module } from '@nestjs/common';
import { KlassService } from './klass.service';
import { KlassController } from './klass.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KlassEntity } from './entities/klass.entity';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([KlassEntity]), UtilsModule, FileModule],
  controllers: [KlassController],
  providers: [KlassService],
})
export class KlassModule {}
