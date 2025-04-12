import * as chatRepository from '../../../data-access/chat-repository';
import { getUserById } from '../../get-user-by-id';
import { throwIfChatRoomNotExists } from '../../validation/chat-room/validate-room-existence';

export async function deleteUserFromChatRoomUseCase(
  chatRoomId: number,
  userId: number
) {
  await throwIfChatRoomNotExists(chatRoomId);
  await getUserById(userId);

  const response = await chatRepository.deleteUserFromChatRoomRepo(
    chatRoomId,
    userId
  );

  return response;
}
