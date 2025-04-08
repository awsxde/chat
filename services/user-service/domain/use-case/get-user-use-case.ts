import { AppError } from '@practica/error-handling';
import * as userRepository from '../../data-access/user-repository';

export async function getUser(userId: number) {
  const response = await userRepository.getUserById(userId);

  if (!response) {
    throw new AppError(
      'user-does-not-exist',
      `The user with id ${userId} does not exist`,
      404,
      false
    );
  }

  return response;
}
