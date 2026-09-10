export function normalizeGmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isGmail(email: string): boolean {
  return /^[^\s@]+@(gmail|googlemail)\.com$/.test(normalizeGmail(email));
}

export function nameFromGmail(email: string): string {
  const local = normalizeGmail(email).split("@")[0] ?? "jovem";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
