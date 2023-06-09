export function clearCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=; expires=${new Date().toUTCString()}; path=/; SameSite=None; secure`;
  });
}
