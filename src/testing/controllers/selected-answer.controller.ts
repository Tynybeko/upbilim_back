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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SelectedAnswerService } from '../services/selected-answer.service';
import { CreateSelectedAnswerDto } from '../dto/selected-answer/create-selected-answer.dto';
import { SelectedQueryDto } from '../dto/selected-answer/selected-query.dto';
import { UpdateSelectedAnswerDto } from '../dto/selected-answer/update-selected-answer.dto';
import { SelectedAnswerGuard } from '../guards/selected-answer.guard';

@ApiTags('Selected Answer')
@Controller('/selected-answers')
export class SelectedAnswerController {
  constructor(private selectedAnswerService: SelectedAnswerService) {}

  @Post()
  create(@Body() createSelectedAnswerDto: CreateSelectedAnswerDto) {
    return this.selectedAnswerService.create(createSelectedAnswerDto);
  }

  @Get()
  findAll(@Query() query: SelectedQueryDto) {
    return this.selectedAnswerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.selectedAnswerService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(SelectedAnswerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    updateSelectedAnswerDto: UpdateSelectedAnswerDto,
  ) {
    return this.selectedAnswerService.update(+id, updateSelectedAnswerDto);
  }

  @ApiBearerAuth()
  @UseGuards(SelectedAnswerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.selectedAnswerService.remove(+id);
  }
}
