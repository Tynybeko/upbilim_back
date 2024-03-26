import { InjectRepository } from '@nestjs/typeorm';
import { PostImageEntity } from '../entities/post-image.entity';
import { Repository } from 'typeorm';
import { UtilsService } from '../../utils/utils.service';
import { CreatePostImageDto } from '../dto/create-post-image.dto';
import { FileService } from '../../file/file.service';
import { NotFoundException } from '@nestjs/common';
import { PostQueryDto } from '../dto/post-query.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';
import { PostEntity } from '../entities/post.entity';
import { PaginationQueryDto } from '../../utils/dto/pagination-query.dto';

export class PostImageService {
  constructor(
    @InjectRepository(PostImageEntity)
    private postImageRepository: Repository<PostImageEntity>,

    private utils: UtilsService,
    private fileService: FileService,
  ) {}

  async create(
    createPostImageDto: CreatePostImageDto,
  ): Promise<PostImageEntity> {
    const { title, image } = createPostImageDto;

    const postImage = new PostImageEntity();
    postImage.title = title;
    postImage.image = await this.fileService.createFile('post-images', image);

    return await this.postImageRepository.save(postImage);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<IComplexRequest<PostImageEntity[]>> {
    return await this.utils.complexRequest({
      entity: 'post-image',
      repository: this.postImageRepository,
      ...query,
    });
  }

  async findOne(id: number): Promise<PostImageEntity> {
    const postImage = await this.postImageRepository.findOneBy({ id });
    if (!postImage)
      throw new NotFoundException({ message: 'Post image not found' });
    return postImage;
  }

  async remove(id: number): Promise<void> {
    const postImage = await this.findOne(id);
    this.fileService.removeFile(postImage.image, false);
    await postImage.remove();
  }
}
