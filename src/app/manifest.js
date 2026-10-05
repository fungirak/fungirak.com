export default function manifest() {
  return {
    name: "fungirak · Gabriel Lazzarini",
    short_name: "fungirak",
    description: "El CV interactivo de Gabriel Lazzarini: proyectos, filosofía, comunidad y el juego Espora.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0d1f",
    theme_color: "#0a0d1f",
    lang: "es-AR",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
