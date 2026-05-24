/** Read server secrets from process.env or Vite-injected import.meta.env. */
export function serverEnv(...keys: string[]): string {
  const metaEnv = import.meta.env as Record<string, string | undefined>;
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
    const viteValue = metaEnv[key]?.trim();
    if (viteValue) return viteValue;
  }
  return "";
}
