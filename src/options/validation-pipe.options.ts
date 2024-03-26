import { ValidationError } from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';

export const validationPipeOptions = {
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    if (errors.length) {
      let messages = {};
      errors.forEach((err) => {
        messages = {
          ...messages,
          [err.property]: Object.values(err.constraints),
        };
      });
      throw new ValidationException(messages);
    }
  },
};
