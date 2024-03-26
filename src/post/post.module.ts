import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { PostEntity } from './entities/post.entity';
import { FileModule } from '../file/file.module';
import { UtilsModule } from '../utils/utils.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PostImageService } from './services/post-image.service';
import { PostImageEntity } from './entities/post-image.entity';
import { PostImageController } from './controllers/post-image.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PostEntity, PostImageEntity]),
    FileModule,
    UtilsModule,
    NestjsFormDataModule,
  ],
  controllers: [PostImageController, PostController],
  providers: [PostService, PostImageService],
  exports: [PostService],
})
export class PostModule {}
