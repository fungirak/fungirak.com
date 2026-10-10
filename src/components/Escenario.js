"use client";
import { useEffect, useState } from "react";
import { PROYECTOS, INDUSTRIAS } from "@/data/proyectos";
import { useLang, tx } from "@/lib/i18n";
import { Casa, Llave, Persona } from "./Iconos";
import Micelio from "./Micelio";

function Arte({ p }) {
  if (p.id === "teamjoy") return <img src="/img/teamjoy-logo-240.webp" alt="Team Joy" width={118} height={118} style={{ objectFit: "contain" }} />;
  if (p.id === "problematica")
    return (
      <div className="roles" aria-hidden="true">
        <span><Casa width={26} height={26} style={{ color: "#4A90E2" }} /></span>
        <span><Llave width={24} height={24} style={{ color: "#F5C542" }} /></span>
        <span><Persona width={24} height={24} style={{ color: "#50C878" }} /></span>
      </div>
    );
  if (p.tipo === "libro") return <div className="book" aria-hidden="true">{p.id === "libro-1" ? "I" : "II"}</div>;
  if (p.tipo === "ep") return <div className="vinyl" aria-hidden="true" />;
  if (p.logo) return <img className="logo-real" src={p.logo} alt="" width={76} height={76} loading="lazy" />;
  const iniciales = { mitour: "✈", ecos: "📡", atalaya: "🛡️", atlas: "💪", gourmet: "☕", schools: "🏫", telos: "🌙", negro: "🌲" }[p.id];
  return <div className="monogram" aria-hidden="true">{iniciales}</div>;
}

function Card({ p, onOpen, sellado, dim, lit, onHover, idx }) {
  const { lang } = useLang();
  return (
    <button
      className={`card${p.fila === 2 ? " con-pills" : ""}${p.id === "teamjoy" ? " teamjoy" : ""}${dim ? " dim" : ""}${lit ? " lit" : ""}`}
      style={{ "--c": p.color, "--i": idx }}
      data-card={p.id}
      onClick={() => onOpen(p.id)}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(p.id)}
      onBlur={() => onHover(null)}
    >
      {p.badge && <span className="badge">{tx(p.badge, lang)}</span>}
      {sellado && <span className="stamped" title="✓">✓</span>}
      <div className="art">
        <Arte p={p} />
      </div>
      <div className={`name${tx(p.nombre, lang).length > 22 ? " largo" : ""}`}>{tx(p.nombre, lang)}</div>
      <div className="tag">{tx(p.tagline, lang)}</div>
      {p.fila === 2 && (
        <div className="pills">
          {p.pills.slice(0, 3).map((x) => (
            <span key={x} className={`pill${x === "+18" ? " adult" : ""}`}>{x}</span>
          ))}
        </div>
      )}
    </button>
  );
}

export default function Escenario({ onOpen, sellos, onSound }) {
  const { lang, ui } = useLang();
  const [filtro, setFiltro] = useState("todas");
  const [hover, setHover] = useState(null);
  const [ola, setOla] = useState(false);
  const [listo, setListo] = useState(false);

  // La entrada de las cards corre una sola vez; después quedan quietas hasta la próxima ola
  useEffect(() => {
    const t = setTimeout(() => setListo(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // "La ola": al ir a Proyectos, las cards saltan una tras otra (primero la fila de arriba, después la de abajo)
  useEffect(() => {
    let t;
    const hacerOla = () => {
      clearTimeout(t);
      setOla(false);
      // Un instante después se vuelve a activar, así la ola arranca de cero aunque toquen varias veces
      t = setTimeout(() => {
        setOla(true);
        t = setTimeout(() => setOla(false), 2200);
      }, 40);
    };
    window.addEventListener("fgk-ola", hacerOla);
    return () => {
      window.removeEventListener("fgk-ola", hacerOla);
      clearTimeout(t);
    };
  }, []);

  const hoverYSonido = (id) => {
    setHover(id);
    if (id) onSound?.(id);
  };

  const fila = (n) => PROYECTOS.filter((p) => p.fila === n);
  const marca = (p) => filtro !== "todas" && !p.industrias.includes(filtro);
  const brilla = (p) => filtro !== "todas" && p.industrias.includes(filtro);

  return (
    <section className={`escenario${listo ? " listo" : ""}${ola ? " ola" : ""}`} id="proyectos" aria-label={ui.nav.proyectos}>
      <Micelio filtro={filtro} hover={hover} />

      <div className="filtros" role="group" aria-label={ui.filtrar}>
        {INDUSTRIAS.map((i) => (
          <button key={i.id} className="chip" style={{ "--chip": i.color }} aria-pressed={filtro === i.id} onClick={() => setFiltro(i.id)}>
            {tx(i, lang)}
          </button>
        ))}
      </div>

      {[1, 2].map((n) => (
        <div className="fila" key={n}>
          <div className="fila-head">
            <h2 className="display">{n === 1 ? ui.fila1 : ui.fila2}</h2>
            <span className="count" title={lang === "es" ? "Cada card que abrís te da un sello en tu Pasaporte FUNGIRAK" : "Every card you open gives you a stamp in your FUNGIRAK Passport"}>
              ✓ {lang === "es" ? "Abriste" : "Opened"} {fila(n).filter((p) => sellos.includes(p.id)).length} {lang === "es" ? "de" : "of"} {fila(n).length}
            </span>
          </div>
          <div className="cards">
            {fila(n).map((p, idx) => (
              <Card key={p.id} p={p} idx={idx + (n - 1) * 5} onOpen={onOpen} sellado={sellos.includes(p.id)} dim={marca(p)} lit={brilla(p)} onHover={hoverYSonido} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
