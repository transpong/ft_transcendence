export function clearCookies () {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    document.cookie = cookies[i] + "=; expires=" + new Date(0).toUTCString() + "; SameSite=None; secure";
  }
}
