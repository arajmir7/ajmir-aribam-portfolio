import { NextResponse } from "next/server";

export const runtime = "nodejs";
export async function GET() {
  const api = process.env.CONTACT_API_URL;
  if (!api)
    return NextResponse.json(
      {
        status: "unavailable",
        revision: process.env.BUILD_REVISION || "unknown",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const response = await fetch(`${api.replace(/\/$/, "")}/health/ready`, {
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("not ready");
    return NextResponse.json(
      { status: "ready", revision: process.env.BUILD_REVISION || "unknown" },
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
