import bcrypt from 'bcrypt';
import { createUserRepo } from '../../data-access/user-repository';
import { createUserDTO } from '../user-schema';
import { assertNewUserIsValid } from '../validation/create-user-validators';
import { throwIfEmailExists } from '../validation/validate-user-existence';

export async function createUserUseCase(newUser: createUserDTO) {
  await assertNewUserIsValid(newUser);
  await throwIfEmailExists(newUser.email);

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  const finalUserToSave = { ...newUser, password: hashedPassword };

  const response = await createUserRepo(finalUserToSave);

  return response;
}
