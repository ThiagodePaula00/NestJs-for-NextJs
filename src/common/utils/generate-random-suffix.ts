export function generateRandomSuffix(): string {
  return Math.random().toString(36).substring(2, 8);
}
