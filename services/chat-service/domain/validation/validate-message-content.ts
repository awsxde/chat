export function throwIfContentInvalid(content: string) {
  if (!content.trim()) {
    return false;
  }

  return true;
}
