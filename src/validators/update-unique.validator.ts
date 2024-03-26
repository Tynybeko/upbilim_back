import { Injectable } from '@nestjs/common';
import { DataSource, Not } from 'typeorm';
import { ValidationException } from '../exceptions/validation.exception';

export interface IUpdateUniqueValidatorConstrains {
  columnName: string;
  id: string | number;
  message: string;
  table: any;
  value: any;
}

@Injectable()
export class UpdateUniqueValidator {
  constructor(private dataSource: DataSource) {}
  async validate(constraints: IUpdateUniqueValidatorConstrains[]) {
    let errors = {};
    for (const item of constraints) {
      const repository = this.dataSource.getRepository(item.table);
      const data = await repository.findOne({
        where: { [item.columnName]: item.value, id: Not(item.id) },
      });
      if (data !== null) {
        errors = { ...errors, [item.columnName]: item.message };
      }
    }
    if (!Object.keys(errors).length) {
      throw new ValidationException(errors);
    }
    return true;
  }
}
