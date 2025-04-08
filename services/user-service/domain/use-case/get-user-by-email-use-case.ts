import { AppError } from '@practica/error-handling';
import * as userRepository from '../../data-access/user-repository';

export async function getUserByEmail(email: string) {
  const response = await userRepository.getUserByEmail(email);

  if (!response) {
    throw new AppError(
      'user-does-not-exists',
      `The user with email ${email} does not exists`,
      404,
      false
    );
  }

  return response;
}
