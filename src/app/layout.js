import { Unbounded, Poppins, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "./comunidad.css";
import { LINKS, PERFIL } from "@/data/perfil";

const display = Unbounded({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--f-display", display: "swap" });
const body = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-mono", display: "swap" });

const SITE = "https://fungirak.com";
const DESC =
  "Gabriel Lazzarini (fungirak), desarrollador de software full stack de Santa Fe, Argentina. Más de 4 años en el Gobierno de Santa Fe, fundador de Team Joy y FUNGIRAK Studio: MiTour, ECOS, Atlas Fit Pro y más.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Gabriel Lazzarini · fungirak · Desarrollador Full Stack", template: "%s · fungirak" },
  description: DESC,
  keywords: ["Gabriel Lazzarini", "fungirak", "desarrollador full stack", "full stack developer Argentina", "Santa Fe", "Team Joy", "FUNGIRAK Studio", "Next.js", "React", "Java Spring Boot", "freelance developer"],
  authors: [{ name: "Gabriel Lazzarini", url: SITE }],
  creator: "FUNGIRAK Studio",
  publisher: "FUNGIRAK Studio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE,
    siteName: "fungirak.com",
    title: "Gabriel Lazzarini · Desarrollador Full Stack",
    description: "El CV interactivo de fungirak: proyectos, filosofía y un pasaporte para explorar. Desde Santa Fe, para el mundo.",
    locale: "es_AR",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image", title: "Gabriel Lazzarini · fungirak", description: "Desarrollador full stack · Team Joy · FUNGIRAK Studio" },
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, title: "fungirak", statusBarStyle: "black-translucent" },
  applicationName: "fungirak",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0d1f" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#gabriel`,
      name: PERFIL.nombre,
      alternateName: PERFIL.alias,
      url: SITE,
      image: `${SITE}/img/fotoPerfil.jpg`,
      jobTitle: "Full Stack Software Developer",
      email: `mailto:${LINKS.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Santa Fe", addressRegion: "Santa Fe", addressCountry: "AR" },
      alumniOf: [{ "@type": "CollegeOrUniversity", name: "Universidad Tecnológica Nacional, Facultad Regional Santa Fe" }],
      worksFor: [{ "@type": "GovernmentOrganization", name: "Gobierno de la Provincia de Santa Fe" }, { "@id": `${SITE}/#studio` }],
      founder: [{ "@id": `${SITE}/#studio` }, { "@type": "Organization", name: "Team Joy", url: "https://teamjoy.site" }],
      knowsAbout: ["React", "Next.js", "Java", "Spring Boot", "Oracle", "PostgreSQL", "Three.js", "PHP", "Symfony", "PWA", "UX/UI"],
      sameAs: [LINKS.linkedin, LINKS.github, LINKS.instagram, LINKS.youtube, LINKS.teamjoyPerfil],
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#studio`,
      name: "FUNGIRAK Studio",
      url: SITE,
      email: LINKS.email,
      founder: { "@id": `${SITE}/#gabriel` },
      sameAs: [LINKS.instagram],
    },
  ],
};

// Aplica el tema guardado antes de pintar (sin parpadeo)
const temaScript = `try{var t=localStorage.getItem('fgk-tema');if(!t){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t;var l=localStorage.getItem('fgk-lang');if(l)document.documentElement.lang=l}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="dark" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
