import * as chatRepository from '../../data-access/chat-repository';
import { getUserById } from '../get-user-by-id';
import { throwIfChatRoomNotExists } from '../validation/validate-room-existence';

export async function addUserToChatRoom(chatRoomId: number, userId: number) {
  await throwIfChatRoomNotExists(chatRoomId);
  await getUserById(userId);

  const response = await chatRepository.addUserToChatRoom(chatRoomId, userId);

  return response;
}
