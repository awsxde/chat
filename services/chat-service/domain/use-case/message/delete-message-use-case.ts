import { deleteMessageRepo } from '../../../data-access/chat-repository';
import { throwIfChatRoomNotExists } from '../../validation/chat-room/validate-room-existence';
import { throwIfMessageNotExists } from '../../validation/message/validate-message-existance';

export async function deleteMessageUseCase(
  chatRoomId: number,
  messageId: number
) {
  await throwIfChatRoomNotExists(chatRoomId);
  await throwIfMessageNotExists(messageId);

  const response = await deleteMessageRepo(messageId);

  return response;
}
