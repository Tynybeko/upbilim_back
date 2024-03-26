import { Processor, Process } from '@nestjs/bull';
import { MAILING_QUEUE } from '../constants';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { ConfigService } from '@nestjs/config';
import { PostEntity } from '../post/entities/post.entity';

@Processor(MAILING_QUEUE)
export class MailingQueue {
  constructor(
    private mailingService: MailingService,
    private configService: ConfigService,
  ) {}

  private logger = new Logger(MailingQueue.name);

  @Process()
  async transcode(job: Job<{ post: PostEntity }>) {
    this.logger.log(`Transcoding message: ${job.id}`);

    const post: PostEntity = job.data.post;
    const mailing = await this.mailingService.getAll();
    const recipients = mailing.map((item) => item.email);

    await this.mailingService.sendMail({
      from: this.configService.get<string>('SMTP_USER'),
      to: recipients,
      subject: `Upbilim - ${post.title}`,
      html: `${
        post.description
      } <br> <br> <b>© UpBilim ${new Date().getFullYear()}</b>`,
    });

    this.logger.log(`Transcoding complete for job: ${job.id}`);
  }
}
