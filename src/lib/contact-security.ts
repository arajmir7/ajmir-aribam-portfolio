export function isAllowedOrigin(
  origin: string | null,
  configuredSiteUrl: string | undefined,
): boolean {
  if (!origin) return true;
  if (!configuredSiteUrl) return false;
  try {
    return origin === new URL(configuredSiteUrl).origin;
  } catch {
    return false;
  }
}
