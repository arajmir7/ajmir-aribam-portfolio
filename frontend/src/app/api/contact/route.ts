import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  clientIpFromTrustedHeader,
  contactApiBaseUrl,
  isAllowedOrigin,
  isContactRuntimeReady,
} from "@/lib/contact-security";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const id = randomUUID();
  const expected =
    process.env.CONTACT_ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL;
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin, expected))
    return NextResponse.json(
      { message: "Request origin is not allowed." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json({ message: "Expected JSON." }, { status: 415 });
  const bytes = Number(request.headers.get("content-length") || 0);
  if (bytes > 6000)
    return NextResponse.json(
      { message: "Inquiry is too large." },
      { status: 413 },
    );
  const production = process.env.NODE_ENV === "production";
  const api = contactApiBaseUrl({
    apiUrl: process.env.CONTACT_API_URL,
    apiHostport: process.env.CONTACT_API_HOSTPORT,
    production,
  });
  const token = process.env.CONTACT_INTERNAL_TOKEN;
  const ready = isContactRuntimeReady({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    allowedOrigin: process.env.CONTACT_ALLOWED_ORIGIN,
    apiUrl: process.env.CONTACT_API_URL,
    apiHostport: process.env.CONTACT_API_HOSTPORT,
    internalToken: token,
    trustedClientIpHeader: process.env.CONTACT_CLIENT_IP_HEADER,
    buildRevision: process.env.BUILD_REVISION,
    production,
  });
  if (!api || !token || !ready)
    return NextResponse.json(
      {
        message: "The inquiry service is unavailable. Please use direct email.",
      },
      { status: 503 },
    );
  let payload: unknown;
  const clientIp = clientIpFromTrustedHeader(
    request.headers,
    process.env.CONTACT_CLIENT_IP_HEADER,
  );
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 6000)
      return NextResponse.json(
        { message: "Inquiry is too large." },
        { status: 413 },
      );
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }
  try {
    const response = await fetch(`${api}/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
        "X-Request-ID": id,
        "X-Client-IP": clientIp || "untrusted-proxy",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const result = await response.json();
    const headers = { "X-Request-ID": id, "Cache-Control": "no-store" };
    if (response.status === 422) {
      const errors: Record<string, string> = {};
      for (const item of Array.isArray(result.detail) ? result.detail : []) {
        const key = Array.isArray(item.loc) ? String(item.loc.at(-1)) : "";
        if (["name", "email", "topic", "message"].includes(key))
          errors[key] = `Please check the ${key} field.`;
      }
      return NextResponse.json(
        { message: "Please correct the marked fields.", errors },
        { status: 422, headers },
      );
    }
    if (response.status === 429)
      return NextResponse.json(
        { message: "Too many inquiries. Please try again later." },
        { status: 429, headers },
      );
    if (!response.ok)
      return NextResponse.json(
        { message: "Inquiry could not be sent. Please use direct email." },
        { status: response.status, headers },
      );
    return NextResponse.json(result, { status: response.status, headers });
  } catch {
    console.error(
      JSON.stringify({ event: "contact_upstream_unavailable", request_id: id }),
    );
    return NextResponse.json(
      {
        message: "The inquiry service is unavailable. Please use direct email.",
      },
      { status: 503, headers: { "X-Request-ID": id } },
    );
  }
}
