import { Module } from '@nestjs/common';
import { UpdateUniqueValidator } from './update-unique.validator';
import { UniqueValidator } from './unique.validator';
import { IsExistValidator } from './is-exist.validator';

@Module({
  providers: [UpdateUniqueValidator, UniqueValidator, IsExistValidator],
  exports: [UpdateUniqueValidator, UniqueValidator, IsExistValidator],
})
export class ValidatorModule {}
