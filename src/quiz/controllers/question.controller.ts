import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { QuestionQueryDto } from '../dto/question/question-query.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { QuestionService } from '../services/question.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionOwnerGuard } from '../guards/question-owner.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RateSystemService } from '../../rate/services/rate-system.service';
import { User } from '../../auth/decorators/user.decorator';
import { UserEntity } from '../../user/entities/user.entity';

@ApiTags('Question')
@Controller('/questions')
export class QuestionController {
  constructor(
    private questionService: QuestionService,
    private rateSystemService: RateSystemService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @FormDataRequest()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @User() user: UserEntity,
  ) {
    await this.rateSystemService.checkQuestionCreation(user, createQuestionDto);
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findAll(@Query() query: QuestionQueryDto) {
    return this.questionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, QuestionOwnerGuard)
  @Patch(':id')
  @FormDataRequest()
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, QuestionOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
