import { describe, expect, it } from "vitest";
import {
  clientIpFromTrustedHeader,
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
      "203.0.113.7",
    );
  });
});
