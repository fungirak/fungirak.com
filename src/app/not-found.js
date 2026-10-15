import Pagina404 from "@/components/Pagina404";
// Página de «no existe» animada, con el hongo del Studio y un camino de vuelta a las apps.
export const metadata = { title: "Página no encontrada · FUNGIRAK Studio", robots: { index: false } };
export default function NotFound() {
  return (
    <main className="fk-404">
      <a className="fk-404-marca" href="/"><img src="/img/hongo.svg" alt="" width={34} height={34} /><span>fungirak<small>Studio</small></span></a>
      <Pagina404 icono="/img/hongo.svg" color="#22b8cf" titulo="Esta página se fue a otro proyecto"
        texto="No existe o cambió de lugar. Volvé al Studio y mirá todas las apps, juegos y sitios."
        adornos={["🍄", "✨", "🧪", "🚀"]} acciones={[{ href: "/", t: "Volver a FUNGIRAK" }, { href: "/#proyectos", t: "Ver las apps" }]} clase="btn" clase2="btn ghost" />
    </main>
  );
}
