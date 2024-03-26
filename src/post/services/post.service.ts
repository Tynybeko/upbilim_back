import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { FileService } from '../../file/file.service';
import { UtilsService } from '../../utils/utils.service';
import { PostQueryDto } from '../dto/post-query.dto';
import { IComplexRequest } from '../../utils/interfaces/complex-request.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private fileService: FileService,
    private utils: UtilsService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { image, author, ...rest } = createPostDto;
    const temp = {};

    if (image) {
      temp['image'] = await this.fileService.createFile('post_images', image);
    }

    temp['author'] = await this.utils.getObjectOr404<UserEntity>(
      this.userRepository,
      { where: { id: author } },
      'Author',
    );

    return await this.postRepository.save({ ...rest, ...temp });
  }

  async findAll(query: PostQueryDto): Promise<IComplexRequest<PostEntity[]>> {
    const { author, search, limit, offset } = query;
    const relationFilterQuery = [];

    if (author) {
      relationFilterQuery.push({
        query: 'user.id = :id',
        value: { id: author },
      });
    }

    return await this.utils.complexRequest({
      entity: 'post',
      repository: this.postRepository,
      search,
      searchFields: ['title', 'description', 'content'],
      relationFilterQuery,
      relations: [{ entity: 'user', field: 'author' }],
      limit,
      offset,
    });
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException({ message: 'Post not found' });
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    const { image, author, ...rest } = updatePostDto;
    const temp = {};

    if (image) {
      if (post.image) this.fileService.removeFile(post.image, false);
      temp['image'] = await this.fileService.createFile('post_images', image);
    }

    if (author) {
      temp['author'] = await this.utils.getObjectOr404<UserEntity>(
        this.userRepository,
        { where: { id: author } },
        'Author',
      );
    }

    await this.postRepository.update({ id }, { ...rest, ...temp });

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    if (post.image) this.fileService.removeFile(post.image);
    await post.remove();
  }
}
