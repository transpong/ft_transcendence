import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ValidationError } from '@nestjs/common';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}
