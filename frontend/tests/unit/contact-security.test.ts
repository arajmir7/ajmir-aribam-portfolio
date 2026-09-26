import { describe, expect, it } from "vitest";
import {
  clientIpFromTrustedHeader,
  contactApiBaseUrl,
  isContactRuntimeReady,
  isAllowedOrigin,
} from "../../src/lib/contact-security";

describe("contact origin boundary", () => {
  it("accepts only the configured origin", () => {
    expect(
      isAllowedOrigin("https://ajmir.example", "https://ajmir.example/"),
    ).toBe(true);
  });
  it("rejects missing, foreign, lookalike, and unconfigured origins", () => {
    expect(isAllowedOrigin(null, "https://ajmir.example")).toBe(false);
    expect(
      isAllowedOrigin(
        "https://ajmir.example.evil.test",
        "https://ajmir.example",
      ),
    ).toBe(false);
    expect(
      isAllowedOrigin("http://ajmir.example", "https://ajmir.example"),
    ).toBe(false);
    expect(isAllowedOrigin("https://ajmir.example", undefined)).toBe(false);
  });
});

describe("contact client address boundary", () => {
  const headers = new Headers({
    "x-forwarded-for": "203.0.113.7, 10.0.0.2",
    "x-real-ip": "198.51.100.9",
  });

  it("ignores proxy headers until one is explicitly trusted", () => {
    expect(clientIpFromTrustedHeader(headers, undefined)).toBeNull();
    expect(clientIpFromTrustedHeader(headers, "forwarded")).toBeNull();
  });

  it("reads only the configured proxy header", () => {
    expect(clientIpFromTrustedHeader(headers, "x-real-ip")).toBe(
      "198.51.100.9",
    );
    expect(clientIpFromTrustedHeader(headers, "x-forwarded-for")).toBe(
      "10.0.0.2",
    );
  });

  it("uses the address appended by the trusted edge, never a spoofable first entry", () => {
    const spoofed = new Headers({
      "x-forwarded-for": "192.0.2.44, 198.51.100.18",
    });
    expect(clientIpFromTrustedHeader(spoofed, "x-forwarded-for")).toBe(
      "198.51.100.18",
    );
    expect(
      clientIpFromTrustedHeader(
        new Headers({ "x-forwarded-for": "192.0.2.44, not-an-ip" }),
        "x-forwarded-for",
      ),
    ).toBeNull();
  });
});

describe("contact runtime readiness", () => {
  const productionConfig = {
    siteUrl: "https://ajmiraribam.me",
    allowedOrigin: "https://ajmiraribam.me",
    apiHostport: "portfolio-api.internal:8000",
    internalToken: "a-random-production-token-with-32-characters",
    trustedClientIpHeader: "x-forwarded-for",
    buildRevision: "0123456789abcdef0123456789abcdef01234567",
    production: true,
  };

  it("requires the canonical origin, private API, token, proxy, and Git revision", () => {
    expect(isContactRuntimeReady(productionConfig)).toBe(true);
    expect(contactApiBaseUrl(productionConfig)).toBe(
      "http://portfolio-api.internal:8000",
    );
    expect(
      isContactRuntimeReady({ ...productionConfig, allowedOrigin: "" }),
    ).toBe(false);
    expect(
      isContactRuntimeReady({ ...productionConfig, internalToken: "" }),
    ).toBe(false);
    expect(
      isContactRuntimeReady({ ...productionConfig, trustedClientIpHeader: "" }),
    ).toBe(false);
    expect(
      isContactRuntimeReady({ ...productionConfig, buildRevision: "unknown" }),
    ).toBe(false);
    expect(
      isContactRuntimeReady({
        ...productionConfig,
        siteUrl: "http://example.com",
      }),
    ).toBe(false);
    expect(
      isContactRuntimeReady({
        ...productionConfig,
        apiHostport: undefined,
        apiUrl: "https://public-api.example",
      }),
    ).toBe(false);
    expect(
      isContactRuntimeReady({
        ...productionConfig,
        trustedClientIpHeader: "x-real-ip",
      }),
    ).toBe(false);
  });

  it("rejects localhost and malformed private API addresses in production", () => {
    expect(
      contactApiBaseUrl({
        ...productionConfig,
        apiHostport: undefined,
        apiUrl: "http://localhost:8000",
      }),
    ).toBeNull();
    expect(
      contactApiBaseUrl({ ...productionConfig, apiHostport: "127.0.0.1:8000" }),
    ).toBeNull();
    expect(
      contactApiBaseUrl({ ...productionConfig, apiHostport: "api:99999" }),
    ).toBeNull();
  });
});
