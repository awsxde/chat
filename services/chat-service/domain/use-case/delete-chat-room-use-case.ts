import * as chatRepository from '../../data-access/chat-repository';
import { throwIfChatRoomNotExists } from '../validation/validate-room-existence';

export async function deleteChatRoom(chatRoomId: number) {
  throwIfChatRoomNotExists(chatRoomId);

  const response = await chatRepository.deleteChatRoom(chatRoomId);

  return response;
}
