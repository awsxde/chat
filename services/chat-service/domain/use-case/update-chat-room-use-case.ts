import * as chatRepository from '../../data-access/chat-repository';
import { updateChatRoomDTO } from '../chat-schema';
import { getUserById } from '../get-user-by-id';
import { assertChatRoomIsValid } from '../validation/update-chat-room-validators';
import { throwIfChatRoomNotExists } from '../validation/validate-room-existence';

export async function updateChatRoom(chatRoom: updateChatRoomDTO) {
  await assertChatRoomIsValid(chatRoom);
  await throwIfChatRoomNotExists(chatRoom.id);
  // Check all users exist before proceeding
  await Promise.all(
    chatRoom.userIds.map(async (userId) => {
      await getUserById(userId);
    })
  );

  const response = await chatRepository.updateChatRoom(chatRoom);

  return response;
}
