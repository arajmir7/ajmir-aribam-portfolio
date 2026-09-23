import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") || 0) > 512)
    return new NextResponse(null, { status: 413 });
  try {
    const raw = await request.text();
    if (raw.length > 512) return new NextResponse(null, { status: 413 });
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object")
      return new NextResponse(null, { status: 400 });
    const event = value as Record<string, unknown>;
    if (
      event.kind === "web_vital" &&
      ["LCP", "INP", "CLS"].includes(String(event.name)) &&
      typeof event.value === "number" &&
      Number.isFinite(event.value) &&
      event.value >= 0 &&
      event.value < 1e7
    ) {
      console.info(
        JSON.stringify({
          event: "web_vital",
          name: event.name,
          value: event.value,
        }),
      );
    } else if (
      ["client_error", "unhandled_rejection"].includes(String(event.kind)) &&
      typeof event.errorType === "string" &&
      /^[A-Za-z]{1,80}$/.test(event.errorType)
    ) {
      console.info(
        JSON.stringify({ event: event.kind, error_type: event.errorType }),
      );
    } else return new NextResponse(null, { status: 400 });
    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
