import * as chatRepository from '../../data-access/chat-repository';
import { throwIfMessageNotExists } from '../validation/validate-message-existance';
import { throwIfChatRoomNotExists } from '../validation/validate-room-existence';

export async function deleteMessage(chatRoomId: number, messageId: number) {
  await throwIfChatRoomNotExists(chatRoomId);
  await throwIfMessageNotExists(messageId);
  const response = await chatRepository.deleteMessage(messageId);
  return response;
}
