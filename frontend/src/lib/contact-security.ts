import { isIP } from "node:net";

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
      return validIp(headers.get("x-real-ip")?.trim());
    case "x-forwarded-for":
      // Render's edge proxy appends the visitor address. Earlier entries can
      // be supplied by the caller and therefore must never be trusted.
      return validIp(headers.get("x-forwarded-for")?.split(",").at(-1)?.trim());
    default:
      return null;
  }
}

function validIp(value: string | undefined): string | null {
  return value && isIP(value) ? value : null;
}

export type ContactRuntimeConfig = {
  siteUrl?: string;
  allowedOrigin?: string;
  apiUrl?: string;
  apiHostport?: string;
  internalToken?: string;
  trustedClientIpHeader?: string;
  buildRevision?: string;
  production?: boolean;
};

export function contactApiBaseUrl(config: ContactRuntimeConfig): string | null {
  if (
    config.apiHostport &&
    /^[a-zA-Z0-9.-]+:\d{1,5}$/.test(config.apiHostport)
  ) {
    try {
      const url = new URL(`http://${config.apiHostport}`);
      if (
        !url.port ||
        Number(url.port) < 1 ||
        Number(url.port) > 65535 ||
        (config.production && isLocalhost(url.hostname))
      ) {
        return null;
      }
      return url.origin;
    } catch {
      return null;
    }
  }
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
      (config.production && isLocalhost(url.hostname))
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

function isLocalhost(hostname: string): boolean {
  return ["localhost", "127.0.0.1", "[::1]"].includes(hostname.toLowerCase());
}

export function isContactRuntimeReady(config: ContactRuntimeConfig): boolean {
  const apiUrl = contactApiBaseUrl(config);
  const token = config.internalToken?.trim();
  const trustedHeader = config.trustedClientIpHeader?.toLowerCase();
  const validHeader = ["x-forwarded-for", "x-real-ip"].includes(
    trustedHeader || "",
  );
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
    !config.apiHostport ||
    trustedHeader !== "x-forwarded-for" ||
    !validHeader ||
    !/^[0-9a-f]{7,64}$/i.test(config.buildRevision || "")
  ) {
    return false;
  }
  try {
    const canonicalOrigin = new URL(config.siteUrl || "");
    const allowedOrigin = new URL(config.allowedOrigin || "");
    return (
      canonicalOrigin.protocol === "https:" &&
      canonicalOrigin.origin === allowedOrigin.origin
    );
  } catch {
    return false;
  }
}
