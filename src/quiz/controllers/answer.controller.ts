import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { AnswerQueryDto } from '../dto/answer/answer-qeury.dto';
import { UpdateAnswerDto } from '../dto/answer/update-answer.dto';
import { AnswerService } from '../services/answer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionOwnerGuard } from '../guards/answer-owner.guard';

@ApiTags('Answer')
@Controller('/answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get()
  findAll(@Query() query: AnswerQueryDto) {
    return this.answerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(QuestionOwnerGuard)
  @Patch(':id')
  @FormDataRequest()
  update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answerService.update(+id, updateAnswerDto);
  }

  @ApiBearerAuth()
  @UseGuards(QuestionOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answerService.remove(+id);
  }
}
