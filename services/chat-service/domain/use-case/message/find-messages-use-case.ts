import { findMessagesRepo } from '../../../data-access/chat-repository';
import { throwIfChatRoomNotExists } from '../../validation/chat-room/validate-room-existence';

export async function findMessagesUseCase(chatRoomId: number) {
  await throwIfChatRoomNotExists(chatRoomId);

  const response = await findMessagesRepo(chatRoomId);

  return response;
}
