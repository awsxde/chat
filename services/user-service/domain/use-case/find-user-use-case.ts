import { AppError } from '@practica/error-handling';
import { findUserByIdRepo } from '../../data-access/user-repository';

export async function findUserByIdUseCase(userId: number) {
  const response = await findUserByIdRepo(userId);

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
