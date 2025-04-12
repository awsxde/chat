import * as chatRepository from '../../../data-access/chat-repository';
import { createMessageDTO } from '../../chat-schema';
import { getUserById } from '../../get-user-by-id';
import { throwIfChatRoomNotExists } from '../../validation/chat-room/validate-room-existence';
import { assertMessageIsValid } from '../../validation/message/create-message-validators';

export async function createMessageUseCase(
  chatRoomId: number,
  message: createMessageDTO
) {
  await throwIfChatRoomNotExists(chatRoomId);
  await getUserById(message.senderId);
  await assertMessageIsValid(message);

  const response = await chatRepository.createMessageRepo(
    chatRoomId,
    message.senderId,
    message.content
  );

  return response;
}
