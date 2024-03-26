import { PartialType } from '@nestjs/swagger';
import { CreateLangDto } from './create-langs.dto';

export class UpdateLangDto extends PartialType(CreateLangDto) { }
