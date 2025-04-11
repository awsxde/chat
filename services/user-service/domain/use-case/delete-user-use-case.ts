import { deleteUserRepo } from '../../data-access/user-repository';
import { throwIfIdNotExists } from '../validation/validate-user-existence';

export async function deleteUserUseCase(userId: number) {
  await throwIfIdNotExists(userId);

  const response = await deleteUserRepo(userId);

  return response;
}
