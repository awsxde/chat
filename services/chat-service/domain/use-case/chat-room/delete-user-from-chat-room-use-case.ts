import * as chatRepository from '../../../data-access/chat-repository';
import { findUserById } from '../../find-user-by-id';
import { throwIfChatRoomNotExists } from '../../validation/chat-room/validate-room-existence';

export async function deleteUserFromChatRoomUseCase(
  chatRoomId: number,
  userId: number
) {
  await throwIfChatRoomNotExists(chatRoomId);
  await findUserById(userId);

  const response = await chatRepository.deleteUserFromChatRoomRepo(
    chatRoomId,
    userId
  );

  return response;
}
