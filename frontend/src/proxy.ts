import { NextRequest, NextResponse } from "next/server";
import { projectBySlug } from "@/content/projects";

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.hostname.toLowerCase() === "www.ajmiraribam.me" &&
    process.env.NEXT_PUBLIC_SITE_URL === "https://ajmiraribam.me"
  ) {
    const canonicalUrl = new URL(request.nextUrl);
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = "ajmiraribam.me";
    canonicalUrl.port = "";
    return NextResponse.redirect(canonicalUrl, 308);
  }
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const dev = process.env.NODE_ENV === "development";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'${dev ? " 'unsafe-inline'" : ""}`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${dev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  requestHeaders.set(
    "x-request-id",
    request.headers.get("x-request-id")?.slice(0, 80) || crypto.randomUUID(),
  );
  const projectRoute = request.nextUrl.pathname.match(/^\/work\/([^/]+)\/?$/);
  const missingProject = projectRoute && !projectBySlug(projectRoute[1]);
  let response: NextResponse;
  if (missingProject) {
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.protocol = "http:";
    notFoundUrl.pathname = "/404";
    notFoundUrl.search = "";
    response = NextResponse.rewrite(notFoundUrl, {
      status: 404,
      request: { headers: requestHeaders },
    });
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  response.headers.set("X-Request-ID", requestHeaders.get("x-request-id")!);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|images/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
