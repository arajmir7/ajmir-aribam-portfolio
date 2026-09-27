import { describe, expect, it } from "vitest";
import {
  clientIpFromTrustedHeader,
  contactApiBaseUrl,
  isContactRuntimeReady,
  isAllowedOrigin,
  readBoundedRequestBody,
  requestIdFromHeaders,
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
  it("reads one valid address only from the explicitly trusted header", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.7",
      "x-real-ip": "198.51.100.9",
    });
    expect(clientIpFromTrustedHeader(headers, undefined)).toBeNull();
    expect(clientIpFromTrustedHeader(headers, "forwarded")).toBeNull();
    expect(clientIpFromTrustedHeader(headers, "x-real-ip")).toBe(
      "198.51.100.9",
    );
    expect(clientIpFromTrustedHeader(headers, "x-forwarded-for")).toBe(
      "203.0.113.7",
    );
  });

  it("rejects caller-controlled proxy chains rather than guessing the trusted hop", () => {
    expect(
      clientIpFromTrustedHeader(
        new Headers({ "x-forwarded-for": "192.0.2.44, 198.51.100.18" }),
        "x-forwarded-for",
      ),
    ).toBeNull();
    expect(
      clientIpFromTrustedHeader(
        new Headers({ "x-forwarded-for": "not-an-ip" }),
        "x-forwarded-for",
      ),
    ).toBeNull();
  });
});

describe("contact runtime readiness", () => {
  const productionConfig = {
    siteUrl: "https://ajmiraribam.me",
    allowedOrigin: "https://ajmiraribam.me",
    apiUrl: "https://deployment.vercel.app",
    internalToken: "a-random-production-token-with-32-characters",
    trustedClientIpHeader: "x-forwarded-for",
    buildRevision: "0123456789abcdef0123456789abcdef01234567",
    production: true,
  };

  it("requires canonical HTTPS, the bound Vercel service, token, proxy, and Git revision", () => {
    expect(isContactRuntimeReady(productionConfig)).toBe(true);
    expect(contactApiBaseUrl(productionConfig)).toBe(
      "https://deployment.vercel.app",
    );
    expect(
      isContactRuntimeReady({ ...productionConfig, allowedOrigin: "" }),
    ).toBe(false);
    expect(isContactRuntimeReady({ ...productionConfig, apiUrl: "" })).toBe(
      false,
    );
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

  it("rejects localhost and malformed API addresses in production", () => {
    expect(
      contactApiBaseUrl({
        ...productionConfig,
        apiUrl: "http://localhost:8000",
      }),
    ).toBeNull();
    expect(
      contactApiBaseUrl({
        ...productionConfig,
        apiUrl: "https://deployment.vercel.app/backend",
      }),
    ).toBe("https://deployment.vercel.app/backend");
    expect(
      contactApiBaseUrl({
        ...productionConfig,
        apiUrl: "https://api.example.com",
      }),
    ).toBeNull();
  });
});

describe("contact proxy request safeguards", () => {
  it("preserves a valid request ID and replaces caller-controlled IDs", () => {
    const trustedId = "550e8400-e29b-41d4-a716-446655440000";
    expect(
      requestIdFromHeaders(new Headers({ "x-request-id": trustedId })),
    ).toBe(trustedId);
    expect(
      requestIdFromHeaders(
        new Headers({ "x-request-id": "attacker supplied" }),
      ),
    ).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it("reads a bounded body and rejects a larger streamed body", async () => {
    const accepted = new Request("https://example.test/api/contact", {
      method: "POST",
      body: JSON.stringify({ message: "hello" }),
    });
    expect(await readBoundedRequestBody(accepted)).toBe('{"message":"hello"}');

    const oversized = new Request("https://example.test/api/contact", {
      method: "POST",
      body: "x".repeat(6001),
    });
    expect(await readBoundedRequestBody(oversized)).toBeNull();
  });
});
