import { getUserByEmail } from '../get-user-by-email';
import { loginUserDTO } from '../user-schema';
import { assertLoginUserIsValid } from '../validation/login-user-validators';
import { verifyPasswordOrThrow } from '../validation/password-validation';
import { signValidToken } from './sign-token';

export async function loginUser(credentials: loginUserDTO) {
  assertLoginUserIsValid(credentials);
  const user = await getUserByEmail(credentials.email);
  await verifyPasswordOrThrow(credentials.password, user!.password);
  const token = signValidToken(user, 'user');

  return token;
}
