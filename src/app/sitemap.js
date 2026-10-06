export default function sitemap() {
  const hoy = new Date();
  return [
    { url: "https://fungirak.com", lastModified: hoy, changeFrequency: "weekly", priority: 1 },
    { url: "https://fungirak.com/cv", lastModified: hoy, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://fungirak.com/sorteo", lastModified: hoy, changeFrequency: "monthly", priority: 0.4 },
  ];
}
