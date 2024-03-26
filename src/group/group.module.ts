import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { SchoolEntity } from '../school/entities/school.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, SchoolEntity]), UtilsModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
