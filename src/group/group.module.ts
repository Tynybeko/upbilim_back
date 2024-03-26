import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { SchoolEntity } from '../school/entities/school.entity';
import { UtilsModule } from '../utils/utils.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, SchoolEntity]), UtilsModule, FileModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
