import { AppError } from '@practica/error-handling';
import { findMessageRepo } from '../../../data-access/chat-repository';

export async function throwIfMessageNotExists(id: number) {
  const message = await findMessageRepo(id);

  if (!message) {
    throw new AppError(
      'message-does-not-exists',
      `The message with id ${id} does not exists`,
      404,
      false
    );
  }
}
