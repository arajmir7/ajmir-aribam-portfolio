import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  clientIpFromTrustedHeader,
  contactApiBaseUrl,
  isAllowedOrigin,
  isContactRuntimeReady,
  readBoundedRequestBody,
  requestIdFromHeaders,
} from "@/lib/contact-security";

export const runtime = "nodejs";
export const maxDuration = 20;

const maxBodyBytes = 6000;
export async function POST(request: NextRequest) {
  const id = requestIdFromHeaders(request.headers);
  const headers = { "X-Request-ID": id, "Cache-Control": "no-store" };
  const reject = (message: string, status: number) =>
    NextResponse.json({ message }, { status, headers });
  const idempotencyKey = request.headers.get("idempotency-key");
  const expected =
    process.env.CONTACT_ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL;
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin, expected))
    return reject("Request origin is not allowed.", 403);
  if (
    request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase() !== "application/json"
  )
    return reject("Expected JSON.", 415);
  if (
    idempotencyKey &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      idempotencyKey,
    )
  )
    return reject("A valid request key is required.", 400);
  const contentLength = request.headers.get("content-length");
  if (
    contentLength &&
    (!/^\d+$/.test(contentLength) || Number(contentLength) > maxBodyBytes)
  )
    return reject("Inquiry is too large.", 413);
  const production = process.env.VERCEL_ENV === "production";
  const api = contactApiBaseUrl({
    apiUrl: process.env.CONTACT_API_URL,
    production,
  });
  const buildRevision = process.env.VERCEL_GIT_COMMIT_SHA;
  const token = process.env.CONTACT_INTERNAL_TOKEN;
  const ready = isContactRuntimeReady({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    allowedOrigin: process.env.CONTACT_ALLOWED_ORIGIN,
    apiUrl: process.env.CONTACT_API_URL,
    internalToken: token,
    trustedClientIpHeader: process.env.CONTACT_CLIENT_IP_HEADER,
    buildRevision,
    production,
  });
  if (!api || !token || !ready)
    return NextResponse.json(
      {
        message: "The inquiry service is unavailable. Please use direct email.",
      },
      { status: 503, headers },
    );
  let payload: unknown;
  const clientIp = clientIpFromTrustedHeader(
    request.headers,
    process.env.CONTACT_CLIENT_IP_HEADER,
  );
  try {
    const body = await readBoundedRequestBody(request, maxBodyBytes);
    if (body === null) return reject("Inquiry is too large.", 413);
    payload = JSON.parse(body);
  } catch {
    return reject("Invalid request body.", 400);
  }
  try {
    const response = await fetch(`${api}/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
        "X-Request-ID": id,
        "Idempotency-Key": idempotencyKey || randomUUID(),
        ...(clientIp ? { "X-Client-IP": clientIp } : {}),
        "X-Source-Origin": origin!,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    const result: unknown = await response.json();
    if (response.status === 422) {
      const errors: Record<string, string> = {};
      const detail =
        result && typeof result === "object" && "detail" in result
          ? result.detail
          : [];
      for (const item of Array.isArray(detail) ? detail : []) {
        const key =
          item &&
          typeof item === "object" &&
          "loc" in item &&
          Array.isArray(item.loc)
            ? String(item.loc.at(-1))
            : "";
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
        { status: response.status === 409 ? 409 : 503, headers },
      );
    const requestId =
      result &&
      typeof result === "object" &&
      "request_id" in result &&
      typeof result.request_id === "string" &&
      result.request_id.length <= 80
        ? result.request_id
        : id;
    return NextResponse.json(
      { message: "Your inquiry was received.", request_id: requestId },
      { status: 200, headers },
    );
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
