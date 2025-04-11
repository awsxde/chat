import * as chatRepository from '../../data-access/chat-repository';
import { createChatRoomDTO } from '../chat-schema';
import { getUserById } from '../get-user-by-id';
import { assertChatRoomIsValid } from '../validation/create-chat-room-validators';

export async function createChatRoom(newChatRoom: createChatRoomDTO) {
  await assertChatRoomIsValid(newChatRoom);
  // Check all users exist before proceeding
  await Promise.all(
    newChatRoom.userIds.map(async (userId) => {
      await getUserById(userId);
    })
  );

  const response = await chatRepository.createChatRoom(newChatRoom);

  return response;
}
