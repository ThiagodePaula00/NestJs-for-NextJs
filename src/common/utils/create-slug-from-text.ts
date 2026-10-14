import { generateRandomSuffix } from './generate-random-suffix.js';
import { slugify } from './slugify.js';

export function createSlugFromText(text: string): string {
  return `${slugify(text)}-${generateRandomSuffix()}`;
}
