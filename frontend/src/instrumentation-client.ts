function send(kind: "client_error" | "unhandled_rejection", errorType: string) {
  try {
    const body = JSON.stringify({ kind, errorType: errorType.slice(0, 80) });
    navigator.sendBeacon?.(
      "/api/telemetry",
      new Blob([body], { type: "application/json" }),
    );
  } catch {
    /* Telemetry must never interrupt the page. */
  }
}

window.addEventListener("error", (event) =>
  send("client_error", event.error?.name || "Error"),
);
window.addEventListener("unhandledrejection", (event) =>
  send("unhandled_rejection", event.reason?.name || "Error"),
);
