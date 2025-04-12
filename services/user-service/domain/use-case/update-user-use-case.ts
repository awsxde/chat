import bcrypt from 'bcrypt';
import { updateUserRepo } from '../../data-access/user-repository';
import { updateUserDTO } from '../user-schema';
import { assertUpdateUserIsValid } from '../validation/update-user-validators';
import { throwIfIdNotExists } from '../validation/validate-user-existence';

export async function updateUserUseCase(user: updateUserDTO) {
  await assertUpdateUserIsValid(user);
  await throwIfIdNotExists(user.id);

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const finalUserToSave = { ...user, password: hashedPassword };

  const response = await updateUserRepo(finalUserToSave);

  return response;
}
