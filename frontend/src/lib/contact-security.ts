import { isIP } from "node:net";
import { randomUUID } from "node:crypto";

const requestIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requestIdFromHeaders(headers: Pick<Headers, "get">): string {
  const incoming = headers.get("x-request-id")?.trim();
  return incoming && requestIdPattern.test(incoming) ? incoming : randomUUID();
}

export async function readBoundedRequestBody(
  request: Request,
  maxBytes = 6000,
): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(body);
}

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
      url.search ||
      url.hash ||
      (config.production &&
        (url.protocol !== "https:" ||
          !url.hostname.endsWith(".vercel.app") ||
          url.port !== ""))
    ) {
      return null;
    }
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
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
