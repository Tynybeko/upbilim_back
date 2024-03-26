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
import { TestingService } from '../services/testing.service';
import { CreateTestingDto } from '../dto/testing/create-testing.dto';
import { UpdateTestingDto } from '../dto/testing/update-testing.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TestingQueryDto } from '../dto/testing/testing-query.dto';
import { TestingGateway } from '../testing.gateway';
import { TestingOwnerGuard } from '../guards/testing-owner.guard';
import { TestingStatusEnum } from '../enum/testing-status.enum';
import { NextQuestionDto } from '../dto/gateway/next-question.dto';
import { QuestionService } from '../../quiz/services/question.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Testing')
@Controller('/testings')
export class TestingController {
  constructor(
    private readonly testingService: TestingService,
    private testingGateway: TestingGateway,
    private questionService: QuestionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTestingDto: CreateTestingDto) {
    return this.testingService.create(createTestingDto);
  }

  @Get()
  findAll(@Query() query: TestingQueryDto) {
    return this.testingService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testingService.findOne(+id);
  }

  @Get('/get-by-code/:code')
  findOneByCode(@Param('code') code: string) {
    return this.testingService.findOneByCode(code);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TestingOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestingDto: UpdateTestingDto) {
    return this.testingService.update(+id, updateTestingDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TestingOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testingService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TestingOwnerGuard)
  @Post('/start-testing/:id')
  async startTesting(@Param('id') id: string) {
    await this.testingService.update(+id, {
      status: TestingStatusEnum.IN_PROCESS,
      quiz: undefined,
      owner: undefined,
    });
    return this.testingGateway.startTesting(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TestingOwnerGuard)
  @Post('/next-question/:id')
  async nextQuestion(
    @Body() nextQuestionDto: NextQuestionDto,
    @Param('id') id: string,
  ) {
    const testing = await this.testingService.findOne(+id);
    const question = await this.questionService.findOne(
      nextQuestionDto.question,
    );
    return this.testingGateway.nextQuestion(testing.id, question);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TestingOwnerGuard)
  @Post('/end-testing/:id')
  async endTesting(@Param('id') id: string) {
    await this.testingService.update(+id, {
      status: TestingStatusEnum.FINISHED,
      quiz: undefined,
      owner: undefined,
    });
    return this.testingGateway.endTesting(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TestingOwnerGuard)
  @Get('/get-testing-access-key/:id')
  getTestingAccessKey(@Param('id') id: string) {
    return this.testingService.getTestingAccessKey(+id);
  }
}
