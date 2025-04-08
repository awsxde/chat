import * as userRepository from '../../data-access/user-repository';
import { throwIfIdNotExists } from '../validation/validate-user-existence';

export async function deleteUser(userId: number) {
  await throwIfIdNotExists(userId);

  const response = await userRepository.deleteUser(userId);

  return response;
}
