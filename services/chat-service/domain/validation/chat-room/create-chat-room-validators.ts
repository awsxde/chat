import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { createChatRoomDTO, createChatRoomSchema } from '../../chat-schema';

export async function assertChatRoomIsValid(
  chatRoomRequest: createChatRoomDTO
) {
  let validationSchema!: ValidateFunction<createChatRoomDTO> | undefined;
  validationSchema = ajv.getSchema<createChatRoomDTO>('new-chat-room');
  if (!validationSchema) {
    ajv.addSchema(createChatRoomSchema, 'new-chat-room');
    validationSchema = ajv.getSchema<createChatRoomDTO>('new-chat-room');
  }

  if (!validationSchema) {
    throw new AppError(
      'unpredictable-validation-failure',
      'An internal validation error occurred where schemas cannot be obtained',
      500,
      false
    );
  }

  const isValid =
    validationSchema(chatRoomRequest) && chatRoomRequest.userIds.length > 0;

  if (!isValid) {
    throw new AppError('invalid-chat-room', `Validation failed`, 400, false);
  }
}
