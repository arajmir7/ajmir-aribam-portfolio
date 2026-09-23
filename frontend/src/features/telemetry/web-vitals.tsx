"use client";
import { useReportWebVitals } from "next/web-vitals";

const report: Parameters<typeof useReportWebVitals>[0] = (metric) => {
  if (!["LCP", "INP", "CLS"].includes(metric.name)) return;
  const body = JSON.stringify({
    kind: "web_vital",
    name: metric.name,
    value: metric.value,
  });
  if (navigator.sendBeacon)
    navigator.sendBeacon(
      "/api/telemetry",
      new Blob([body], { type: "application/json" }),
    );
};

export function WebVitals() {
  useReportWebVitals(report);
  return null;
}
