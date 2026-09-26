import { describe, expect, it } from "vitest";
import { canonicalSiteOrigin } from "../../src/lib/site";

describe("canonical public site origin", () => {
  it("requires a configured HTTPS origin in production", () => {
    expect(() => canonicalSiteOrigin(undefined, "production")).toThrow(
      "NEXT_PUBLIC_SITE_URL is required",
    );
    expect(() =>
      canonicalSiteOrigin("http://ajmiraribam.me", "production"),
    ).toThrow("canonical HTTPS origin");
    expect(canonicalSiteOrigin("https://ajmiraribam.me/", "production")).toBe(
      "https://ajmiraribam.me",
    );
  });

  it("allows localhost only outside production or for explicit local topology tests", () => {
    expect(canonicalSiteOrigin(undefined, "development")).toBe(
      "http://localhost:3000",
    );
    expect(() =>
      canonicalSiteOrigin("http://127.0.0.1:3000", "production"),
    ).toThrow("canonical HTTPS origin");
  });

  it("rejects paths, credentials, and unsupported URL schemes", () => {
    expect(() =>
      canonicalSiteOrigin("https://ajmiraribam.me/path", "production"),
    ).toThrow();
    expect(() =>
      canonicalSiteOrigin("https://user:password@ajmiraribam.me", "production"),
    ).toThrow();
    expect(() =>
      canonicalSiteOrigin("file:///tmp/site", "development"),
    ).toThrow();
  });
});
