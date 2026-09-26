import http from "node:http";
import https from "node:https";
import { readFile } from "node:fs/promises";

const [publicPortValue, upstreamPortValue, certificatePath, privateKeyPath] =
  process.argv.slice(2);
const publicPort = Number(publicPortValue);
const upstreamPort = Number(upstreamPortValue);
if (
  !Number.isInteger(publicPort) ||
  !Number.isInteger(upstreamPort) ||
  !certificatePath ||
  !privateKeyPath
) {
  throw new Error(
    "Usage: e2e-https-proxy <public-port> <upstream-port> <cert> <key>",
  );
}

const [cert, key] = await Promise.all([
  readFile(certificatePath),
  readFile(privateKeyPath),
]);
const server = https.createServer({ cert, key }, (request, response) => {
  const headers = {
    ...request.headers,
    host: request.headers.host || `127.0.0.1:${publicPort}`,
    "x-forwarded-for": request.socket.remoteAddress || "127.0.0.1",
    "x-forwarded-host": request.headers.host || "127.0.0.1",
    "x-forwarded-proto": "https",
  };
  const upstream = http.request(
    {
      hostname: "127.0.0.1",
      port: upstreamPort,
      method: request.method,
      path: request.url,
      headers,
    },
    (upstreamResponse) => {
      response.writeHead(
        upstreamResponse.statusCode || 502,
        upstreamResponse.headers,
      );
      upstreamResponse.pipe(response);
    },
  );
  upstream.on("error", () => {
    if (!response.headersSent) response.writeHead(502);
    response.end("Local HTTPS test proxy could not reach Next.js.");
  });
  request.pipe(upstream);
});

server.listen(publicPort, "127.0.0.1");
