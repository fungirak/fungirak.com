// Cabeceras de seguridad para todo el sitio
const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inyecta scripts en línea (tema sin parpadeo, datos estructurados, hidratación)
      `script-src 'self' https://cuenta.fungirak.com https://www.googletagmanager.com 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' https://*.google-analytics.com https://www.googletagmanager.com data: blob: https://i.ytimg.com https://cuenta.fungirak.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://formsubmit.co https://cuenta.fungirak.com",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
      "media-src 'self' https://www.youtube-nocookie.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }] },
  async headers() {
    return [{ source: "/:path*", headers: security }];
  },
};

export default nextConfig;
