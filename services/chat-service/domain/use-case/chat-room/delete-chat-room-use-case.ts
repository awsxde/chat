import { deleteChatRoomRepo } from '../../../data-access/chat-repository';
import { throwIfChatRoomNotExists } from '../../validation/chat-room/validate-room-existence';

export async function deleteChatRoomUseCase(chatRoomId: number) {
  await throwIfChatRoomNotExists(chatRoomId);

  const response = await deleteChatRoomRepo(chatRoomId);

  return response;
}
