export function parseCorsWhitelist(raw: string): string[] {
  return raw
    .split(/\s+/)
    .map((origin) => origin.replace(/\/+$/, ''))
    .filter(Boolean);
}
