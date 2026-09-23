import { headers } from "next/headers";

export async function StructuredData({
  value,
}: {
  value: Record<string, unknown>;
}) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replace(/</g, "\\u003c"),
      }}
    />
  );
}
