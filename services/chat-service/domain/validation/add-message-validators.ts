import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { createMessageDTO, createMessageSchema } from '../chat-schema';
import { throwIfContentInvalid } from './validate-message-content';

export async function assertMessageIsValid(messageRequest: createMessageDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<createMessageDTO> | undefined;
  validationSchema = ajv.getSchema<createMessageDTO>('create-message');
  if (!validationSchema) {
    ajv.addSchema(createMessageSchema, 'create-message');
    validationSchema = ajv.getSchema<createMessageDTO>('create-message');
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
    validationSchema(messageRequest) &&
    throwIfContentInvalid(messageRequest.content);

  if (!isValid) {
    throw new AppError('invalid-message', `Validation failed`, 400, false);
  }
}
