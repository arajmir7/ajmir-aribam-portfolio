import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ajmir Aribam — Software Engineer",
    short_name: "Ajmir Aribam",
    description: "Selected work and engineering by Ajmir Aribam.",
    start_url: "/",
    display: "browser",
    background_color: "#f5f1e9",
    theme_color: "#2e5a49",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
