import { findUserByEmail } from '../find-user-by-email';
import { signValidToken } from '../sign-token';
import { loginUserDTO } from '../user-schema';
import { assertLoginUserIsValid } from '../validation/login-user-validators';
import { verifyPasswordOrThrow } from '../validation/password-validation';

export async function loginUserUseCase(credentials: loginUserDTO) {
  await assertLoginUserIsValid(credentials);
  const user = await findUserByEmail(credentials.email);

  await verifyPasswordOrThrow(credentials.password, user!.password);

  const token = signValidToken(user, 'user');

  return token;
}
