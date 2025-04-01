import { AppError } from '@practica/error-handling';
import { getMessage } from '../../data-access/chat-repository';

export async function throwIfMessageNotExists(id: number) {
  const message = await getMessage(id);
  if (!message) {
    throw new AppError(
      'message-does-not-exists',
      `The message with id ${id} does not exists`,
      404,
      false
    );
  }
}
