import type { MetadataRoute } from "next";

const siteUrl = "https://mudae-spheres.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ["", "/oh", "/oc", "/oq", "/ot"];
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));
}
