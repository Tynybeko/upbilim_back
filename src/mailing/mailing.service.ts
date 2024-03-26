import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMailingDto } from './dto/create-mailing.dto';
import { UpdateMailingDto } from './dto/update-mailing.dto';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { MailingEntity } from './entities/mailing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../utils/dto/pagination-query.dto';
import { UtilsService } from '../utils/utils.service';
import { IComplexRequest } from '../utils/interfaces/complex-request.interface';
import { SentMessageInfo } from 'nodemailer';
import { InjectQueue } from '@nestjs/bull';
import { MAILING_QUEUE } from '../constants';
import { Queue } from 'bull';
import { PostService } from '../post/services/post.service';

@Injectable()
export class MailingService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(MailingEntity)
    private mailingRepository: Repository<MailingEntity>,

    @InjectQueue(MAILING_QUEUE)
    private mailingQueue: Queue,

    private postService: PostService,

    private utils: UtilsService,
  ) {}

  async sendMail(options: ISendMailOptions): Promise<SentMessageInfo> {
    return await this.mailerService.sendMail(options);
  }

  async sharePost(id: number) {
    const post = await this.postService.findOne(id);
    return await this.mailingQueue.add({ post });
  }

  async create(createMailingDto: CreateMailingDto): Promise<MailingEntity> {
    const mailing = this.mailingRepository.create(createMailingDto);
    return await this.mailingRepository.save(mailing);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<IComplexRequest<MailingEntity[]>> {
    return await this.utils.complexRequest<MailingEntity>({
      entity: 'mailing',
      repository: this.mailingRepository,
      ...query,
    });
  }

  async getAll() {
    return await this.mailingRepository.find();
  }

  async findOne(id: number): Promise<MailingEntity> {
    const mailing = await this.mailingRepository.findOneBy({ id });
    if (!mailing) throw new NotFoundException({ message: 'Mailing not found' });
    return mailing;
  }

  async update(id: number, updateMailingDto: UpdateMailingDto) {
    const mailing = await this.findOne(id);
    return await this.mailingRepository.save({
      ...mailing,
      ...updateMailingDto,
    });
  }

  async remove(id: number): Promise<void> {
    const mailing = await this.findOne(id);
    await mailing.remove();
  }
}
