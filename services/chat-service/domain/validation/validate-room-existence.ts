import { AppError } from '@practica/error-handling';
import { getChatRoomById } from '../../data-access/chat-repository';

export async function throwIfChatRoomNotExists(id: number) {
  const chatRoom = await getChatRoomById(id);
  if (!chatRoom) {
    throw new AppError(
      'chat-room-does-not-exists',
      `The chat room with id ${id} does not exists`,
      404,
      false
    );
  }
}
