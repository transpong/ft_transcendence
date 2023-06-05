export function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop();
    if (cookieValue) {
      const cookieValueSplited = cookieValue.split(";").shift();
      if (cookieValueSplited) return cookieValueSplited;
    }
  }
  return "";
}
