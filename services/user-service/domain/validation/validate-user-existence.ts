import { AppError } from '@practica/error-handling';
import {
  findUserByEmailRepo,
  findUserByIdRepo,
} from '../../data-access/user-repository';

export async function throwIfEmailExists(email: string) {
  const user = await findUserByEmailRepo(email);

  if (user) {
    throw new AppError(
      'user-already-exists',
      `The user with email ${email} already exists`,
      400,
      false
    );
  }
}

export async function throwIfIdNotExists(id: number) {
  const user = await findUserByIdRepo(id);

  if (!user) {
    throw new AppError(
      'user-does-not-exist',
      `The user with id ${id} does not exist`,
      404,
      false
    );
  }
}
