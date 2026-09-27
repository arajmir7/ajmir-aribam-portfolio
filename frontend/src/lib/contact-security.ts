import { isIP } from "node:net";

export function isAllowedOrigin(
  origin: string | null,
  configuredSiteUrl: string | undefined,
): boolean {
  if (!origin || !configuredSiteUrl) return false;
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
  if (
    !configuredHeader ||
    !["x-forwarded-for", "x-real-ip"].includes(configuredHeader.toLowerCase())
  ) {
    return null;
  }
  // Vercel replaces these headers with the connecting client address. Accept one IP only;
  // never guess which element in a caller-supplied proxy chain is trustworthy.
  const value = headers.get(configuredHeader)?.trim();
  return value && !value.includes(",") && isIP(value) ? value : null;
}

export type ContactRuntimeConfig = {
  siteUrl?: string;
  allowedOrigin?: string;
  apiUrl?: string;
  internalToken?: string;
  trustedClientIpHeader?: string;
  buildRevision?: string;
  production?: boolean;
};

export function contactApiBaseUrl(config: ContactRuntimeConfig): string | null {
  if (!config.apiUrl) return null;
  try {
    const url = new URL(config.apiUrl);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      (config.production &&
        (url.protocol !== "https:" ||
          url.origin !== "https://api.ajmiraribam.me"))
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function isContactRuntimeReady(config: ContactRuntimeConfig): boolean {
  const apiUrl = contactApiBaseUrl(config);
  const token = config.internalToken?.trim();
  const trustedHeader = config.trustedClientIpHeader?.toLowerCase();
  if (
    !apiUrl ||
    !token ||
    token.length < 32 ||
    ["replace-with", "changeme", "example"].some((prefix) =>
      token.toLowerCase().startsWith(prefix),
    )
  ) {
    return false;
  }
  if (!config.production) return true;
  if (
    trustedHeader !== "x-forwarded-for" ||
    !/^[0-9a-f]{7,64}$/i.test(config.buildRevision || "")
  ) {
    return false;
  }
  try {
    const canonicalOrigin = new URL(config.siteUrl || "");
    const allowedOrigin = new URL(config.allowedOrigin || "");
    return (
      canonicalOrigin.origin === "https://ajmiraribam.me" &&
      canonicalOrigin.origin === allowedOrigin.origin
    );
  } catch {
    return false;
  }
}
