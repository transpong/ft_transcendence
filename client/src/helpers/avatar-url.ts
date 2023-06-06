export function avatarUrl(path?: string): string {
  return `${import.meta.env.VITE_API_URL}/avatar/img/${path}`;
}