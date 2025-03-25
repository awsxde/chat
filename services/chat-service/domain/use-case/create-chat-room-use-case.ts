import * as chatRepository from '../../data-access/chat-repository';
import { createChatRoomDTO } from '../chat-schema';
import { getUserById } from '../get-user-by-id';
import { assertChatRoomIsValid } from '../validation/create-chat-room-validators';

export async function createChatRoom(newChatRoom: createChatRoomDTO) {
  assertChatRoomIsValid(newChatRoom);
  newChatRoom.userIds.forEach((userId) => {
    getUserById(userId);
  });

  const finalChatRoomToSave = { ...newChatRoom };

  const response = await chatRepository.createChatRoom(
    finalChatRoomToSave.userIds
  );

  return response;
}
