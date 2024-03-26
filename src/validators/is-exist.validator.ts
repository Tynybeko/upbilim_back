import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NestInterceptor } from '@nestjs/common';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsExistValidator implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}
  async validate(value: string, validationArguments: ValidationArguments) {
    const table = validationArguments.constraints[0].table;
    const repository = this.dataSource.getRepository(table);
    const data = await repository.findOne({ where: { id: value } });
    return data === null;
  }
}
