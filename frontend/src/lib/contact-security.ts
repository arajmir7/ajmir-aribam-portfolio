export function isAllowedOrigin(
  origin: string | null,
  configuredSiteUrl: string | undefined,
): boolean {
  if (!origin) return false;
  if (!configuredSiteUrl) return false;
  try {
    return origin === new URL(configuredSiteUrl).origin;
  } catch {
    return false;
  }
}

export function clientIpFromTrustedHeader(
  headers: Pick<Headers, "get">,
  configuredHeader: string | undefined,
): string | null {
  switch (configuredHeader?.toLowerCase()) {
    case "x-real-ip":
      return headers.get("x-real-ip")?.trim() || null;
    case "x-forwarded-for":
      return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    default:
      return null;
  }
}
