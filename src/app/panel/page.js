import PanelGlobal from "@/components/PanelGlobal";
// Sin nombre que lo delate: título genérico, fuera de buscadores y sin enlaces desde el sitio.
export const metadata = { title: "Acceso", robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } } };
export default function Page() { return <PanelGlobal />; }
