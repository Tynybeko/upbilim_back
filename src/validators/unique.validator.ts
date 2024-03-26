import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}
  async validate(value: string, validationArguments: ValidationArguments) {
    const table = validationArguments.constraints[0].table;
    const columnName = validationArguments.constraints[0].column;
    const repository = this.dataSource.getRepository(table);
    const data = await repository.findOne({ where: { [columnName]: value } });
    return data === null;
  }
}
