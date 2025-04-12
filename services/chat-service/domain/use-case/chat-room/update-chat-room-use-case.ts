import * as chatRepository from '../../../data-access/chat-repository';
import { updateChatRoomDTO } from '../../chat-schema';
import { findUserById } from '../../find-user-by-id';
import { assertChatRoomIsValid } from '../../validation/chat-room/update-chat-room-validators';
import { throwIfChatRoomNotExists } from '../../validation/chat-room/validate-room-existence';

export async function updateChatRoomUseCase(chatRoom: updateChatRoomDTO) {
  await assertChatRoomIsValid(chatRoom);
  await throwIfChatRoomNotExists(chatRoom.id);
  // Check all users exist before proceeding
  await Promise.all(
    chatRoom.userIds.map(async (userId) => {
      await findUserById(userId);
    })
  );

  const response = await chatRepository.updateChatRoomRepo(chatRoom);

  return response;
}
