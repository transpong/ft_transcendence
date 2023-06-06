export function avatarUrl(path?: string): string {
  if (!path) return `${import.meta.env.VITE_API_URL}/avatar/img/default.png`;
  return `${import.meta.env.VITE_API_URL}/avatar/img/${path}`;
}
