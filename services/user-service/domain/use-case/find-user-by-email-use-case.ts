import { AppError } from '@practica/error-handling';
import { findUserByEmailRepo } from '../../data-access/user-repository';

export async function findUserByEmailUseCase(email: string) {
  const response = await findUserByEmailRepo(email);

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
