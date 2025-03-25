import * as chatRepository from '../../data-access/chat-repository';
import { throwIfMessageNotExists } from '../validation/validate-message-existance';

export async function deleteMessage(messageId: number) {
  throwIfMessageNotExists(messageId);

  const response = await chatRepository.deleteMessage(messageId);

  return response;
}
