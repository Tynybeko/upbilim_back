import {
  BadRequestException,
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
import { QuizService } from '../services/quiz.service';
import { CreateQuizDto } from '../dto/quiz/create-quiz.dto';
import { UpdateQuizDto } from '../dto/quiz/update-quiz.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { QuizQueryDto } from '../dto/quiz/quiz-query.dto';
import { QuizOwnerGuard } from '../guards/quiz-owner.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { UserEntity } from '../../user/entities/user.entity';
import { RateSystemService } from '../../rate/services/rate-system.service';
import { UserRolesEnum } from '../../user/enums/user-roles.enum';

@ApiTags('Quiz')
@Controller('/quizzers')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private rateSystemService: RateSystemService,
  ) {}



  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  @Post()
  async create(@Body() createQuizDto: CreateQuizDto, @User() user: UserEntity) {
    if (user?.id !== +createQuizDto?.user && user?.role !== UserRolesEnum.ADMIN) {
      throw new BadRequestException({
        message: 'You cannot create quiz for other user',
      });
    }
    await this.rateSystemService.checkQuizCreation(user, createQuizDto);
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll(@Query() query: QuizQueryDto) {
    return this.quizService.findAll(query);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, QuizOwnerGuard)
  @Patch(':id')
  @FormDataRequest()
  async update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @User() user: UserEntity,
  ) {
    await this.rateSystemService.checkQuizUpdating(user, updateQuizDto, +id);
    return this.quizService.update(+id, updateQuizDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, QuizOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }
}
