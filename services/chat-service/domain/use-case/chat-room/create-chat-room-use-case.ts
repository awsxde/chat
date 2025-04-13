import { createChatRoomRepo } from '../../../data-access/chat-repository';
import { createChatRoomDTO } from '../../chat-schema';
import { findUserById } from '../../find-user-by-id';
import { assertChatRoomIsValid } from '../../validation/chat-room/create-chat-room-validators';

export async function createChatRoomUseCase(newChatRoom: createChatRoomDTO) {
  await assertChatRoomIsValid(newChatRoom);
  // Check all users exist before proceeding
  await Promise.all(
    newChatRoom.userIds.map(async (userId) => {
      await findUserById(userId);
    })
  );

  const response = await createChatRoomRepo(newChatRoom);

  return response;
}
