import { AppError } from '@practica/error-handling';
import * as chatRepository from '../../../data-access/chat-repository';

export async function findChatRoomUseCase(chatRoomId: number) {
  const response = await chatRepository.findChatRoomByIdRepo(chatRoomId);

  if (!response) {
    throw new AppError(
      'chat-room-does-not-exist',
      `The chat room with id ${chatRoomId} does not exist`,
      404,
      false
    );
  }

  return response;
}
