import { AppError } from '@practica/error-handling';

export async function throwIfContentInvalid(content: string) {
  if (!content.trim()) {
    throw new AppError(
      'message-content-is-empty',
      `Message content cannot be empty.`,
      400,
      false
    );
  }
}
