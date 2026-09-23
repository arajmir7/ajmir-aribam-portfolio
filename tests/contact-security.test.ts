import { describe, expect, it } from "vitest";
import { isAllowedOrigin } from "../src/lib/contact-security";

describe("contact origin boundary", () => {
  it("accepts the configured origin and requests without an Origin header", () => {
    expect(
      isAllowedOrigin("https://ajmir.example", "https://ajmir.example/"),
    ).toBe(true);
    expect(isAllowedOrigin(null, "https://ajmir.example")).toBe(true);
  });
  it("rejects foreign, lookalike, and unconfigured origins", () => {
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
