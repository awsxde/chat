import * as chatRepository from '../../data-access/chat-repository';
import { throwIfChatRoomNotExists } from '../validation/validate-room-existence';

export async function getMessages(chatRoomId: number) {
  await throwIfChatRoomNotExists(chatRoomId);
  const response = await chatRepository.getMessages(chatRoomId);
  return response;
}
