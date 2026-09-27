import { NextResponse } from "next/server";
import {
  contactApiBaseUrl,
  isContactRuntimeReady,
} from "@/lib/contact-security";

export const runtime = "nodejs";
export async function GET() {
  const production = process.env.NODE_ENV === "production";
  const api = contactApiBaseUrl({
    apiUrl: process.env.CONTACT_API_URL,
    apiHostport: process.env.CONTACT_API_HOSTPORT,
    production,
  });
  const ready = isContactRuntimeReady({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    allowedOrigin: process.env.CONTACT_ALLOWED_ORIGIN,
    apiUrl: process.env.CONTACT_API_URL,
    apiHostport: process.env.CONTACT_API_HOSTPORT,
    internalToken: process.env.CONTACT_INTERNAL_TOKEN,
    trustedClientIpHeader: process.env.CONTACT_CLIENT_IP_HEADER,
    buildRevision: process.env.BUILD_REVISION,
    production,
  });
  if (!api || !ready)
    return NextResponse.json(
      {
        status: "unavailable",
        revision: process.env.BUILD_REVISION || "unknown",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const response = await fetch(`${api}/health/ready`, {
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("not ready");
    const serviceHealth = (await response.json()) as {
      database?: string;
      email_delivery?: string;
      outbox?: {
        pending?: number;
        attempting?: number;
        sent?: number;
        failed?: number;
      };
    };
    return NextResponse.json(
      {
        status: "ready",
        revision: process.env.BUILD_REVISION || "unknown",
        database: serviceHealth.database === "ready" ? "ready" : "unavailable",
        email_delivery: [
          "configured",
          "not_configured",
          "misconfigured",
        ].includes(serviceHealth.email_delivery || "")
          ? serviceHealth.email_delivery
          : "misconfigured",
        outbox: {
          pending: serviceHealth.outbox?.pending || 0,
          attempting: serviceHealth.outbox?.attempting || 0,
          sent: serviceHealth.outbox?.sent || 0,
          failed: serviceHealth.outbox?.failed || 0,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        status: "unavailable",
        revision: process.env.BUILD_REVISION || "unknown",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
