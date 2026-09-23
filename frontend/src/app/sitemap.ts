import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { writing } from "@/content/writing";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/work",
    "/engineering",
    "/labs",
    "/about",
    "/resume",
    "/notes",
    "/contact",
    "/privacy",
    ...projects.map((x) => `/work/${x.slug}`),
    ...writing.map((x) => `/notes/${x.slug}`),
  ];
  return paths.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
