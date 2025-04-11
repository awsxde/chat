import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { chatRoomSchema, updateChatRoomDTO } from '../chat-schema';

export async function assertChatRoomIsValid(
  chatRoomRequest: updateChatRoomDTO
) {
  let validationSchema!: ValidateFunction<updateChatRoomDTO> | undefined;
  validationSchema = ajv.getSchema<updateChatRoomDTO>('chat-room');
  if (!validationSchema) {
    ajv.addSchema(chatRoomSchema, 'chat-room');
    validationSchema = ajv.getSchema<updateChatRoomDTO>('chat-room');
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
