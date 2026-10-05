export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }], sitemap: "https://www.fungirak.com/sitemap.xml" };
}
