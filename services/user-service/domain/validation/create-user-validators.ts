import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { createUserDTO, createUserSchema } from '../user-schema';
import { isValidEmail } from './email-validation';
import { isStrongPassword } from './password-validation';

export async function assertNewUserIsValid(newUserRequest: createUserDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<createUserDTO> | undefined;
  validationSchema = ajv.getSchema<createUserDTO>('new-user');
  if (!validationSchema) {
    ajv.addSchema(createUserSchema, 'new-user');
    validationSchema = ajv.getSchema<createUserDTO>('new-user');
  }

  if (validationSchema === undefined) {
    throw new AppError(
      'unpredictable-validation-failure',
      'An internal validation error occured where schemas cant be obtained',
      500,
      false
    );
  }

  const isValid =
    validationSchema(newUserRequest) &&
    isStrongPassword(newUserRequest.password) &&
    isValidEmail(newUserRequest.email);

  if (!isValid) {
    throw new AppError('invalid-user', `Validation failed`, 400, false);
  }
}
