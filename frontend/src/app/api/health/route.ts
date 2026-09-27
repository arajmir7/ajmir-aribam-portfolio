import { NextResponse } from "next/server";
import {
  contactApiBaseUrl,
  isContactRuntimeReady,
} from "@/lib/contact-security";

export const runtime = "nodejs";
export async function GET() {
  const production = process.env.VERCEL_ENV === "production";
  const buildRevision = process.env.VERCEL_GIT_COMMIT_SHA || "unknown";
  const api = contactApiBaseUrl({
    apiUrl: process.env.CONTACT_API_URL,
    production,
  });
  const ready = isContactRuntimeReady({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    allowedOrigin: process.env.CONTACT_ALLOWED_ORIGIN,
    apiUrl: process.env.CONTACT_API_URL,
    internalToken: process.env.CONTACT_INTERNAL_TOKEN,
    trustedClientIpHeader: process.env.CONTACT_CLIENT_IP_HEADER,
    buildRevision,
    production,
  });
  if (!api || !ready)
    return NextResponse.json(
      {
        status: "unavailable",
        revision: buildRevision,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const response = await fetch(`${api}/health/ready`, {
      headers: { "X-Internal-Token": process.env.CONTACT_INTERNAL_TOKEN || "" },
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("not ready");
    await response.body?.cancel();
    return NextResponse.json(
      {
        status: "ready",
        revision: buildRevision,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        status: "unavailable",
        revision: buildRevision,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
