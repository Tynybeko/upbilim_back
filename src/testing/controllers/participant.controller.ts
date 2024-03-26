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
import { ParticipantService } from '../services/participant.service';
import { CreateParticipantDto } from '../dto/participant/create-participant.dto';
import { ParticipantQueryDto } from '../dto/participant/participant-query.dto';
import { UpdateParticipantDto } from '../dto/participant/update-participant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParticipantGuard } from '../guards/participant.guard';

@ApiTags('Participant')
@Controller('/participants')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantService.create(createParticipantDto);
  }

  @Get()
  findAll(@Query() query: ParticipantQueryDto) {
    return this.participantService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(ParticipantGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.participantService.update(+id, updateParticipantDto);
  }

  @ApiBearerAuth()
  @UseGuards(ParticipantGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participantService.remove(+id);
  }
}
