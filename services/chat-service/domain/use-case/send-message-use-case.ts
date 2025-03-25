import * as chatRepository from '../../data-access/chat-repository';
import { createMessageDTO } from '../chat-schema';
import { assertMessageIsValid } from '../validation/add-message-validators';
import { throwIfChatRoomNotExists } from '../validation/validate-room-existence';

export async function sendMessage(
  chatRoomId: number,
  message: createMessageDTO
) {
  throwIfChatRoomNotExists(chatRoomId);
  assertMessageIsValid(message);

  const response = await chatRepository.sendMessage(
    chatRoomId,
    message.senderId,
    message.content
  );

  return response;
}
