import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingEntity } from './entities/mailing.entity';
import { MailingQueue } from './mailing.queue';
import { BullModule } from '@nestjs/bull';
import { MAILING_QUEUE } from '../constants';
import { PostModule } from '../post/post.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailingEntity]),
    PostModule,
    ConfigModule,
    UtilsModule,
    BullModule.registerQueue({
      name: MAILING_QUEUE,
    }),
  ],
  controllers: [MailingController],
  providers: [MailingService, MailingQueue],
  exports: [MailingService],
})
export class MailingModule {}
