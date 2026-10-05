"use client";
import { useState } from "react";
import { PROYECTOS, INDUSTRIAS } from "@/data/proyectos";
import { useLang, tx } from "@/lib/i18n";
import { Casa, Llave, Persona } from "./Iconos";
import Micelio from "./Micelio";

function Arte({ p }) {
  if (p.id === "teamjoy") return <img src="/img/teamjoy-logo.jpg" alt="Team Joy" width={118} height={118} style={{ objectFit: "contain" }} />;
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
  const iniciales = { mitour: "✈", ecos: "📡", atlas: "💪", gourmet: "☕", schools: "🏫", telos: "🌙", negro: "🌲" }[p.id];
  return <div className="monogram" aria-hidden="true">{iniciales}</div>;
}

function Card({ p, onOpen, sellado, dim, lit, onHover, idx }) {
  const { lang } = useLang();
  return (
    <button
      className={`card${p.id === "teamjoy" ? " teamjoy" : ""}${dim ? " dim" : ""}${lit ? " lit" : ""}`}
      style={{ "--c": p.color, animationDelay: `${0.25 + idx * 0.07}s` }}
      data-card={p.id}
      onClick={() => onOpen(p.id)}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(p.id)}
      onBlur={() => onHover(null)}
      aria-label={`${tx(p.nombre, lang)}: ${tx(p.tagline, lang)}`}
    >
      {p.badge && <span className="badge">{tx(p.badge, lang)}</span>}
      {sellado && <span className="stamped" title="✓">✓</span>}
      <div className="art">
        <Arte p={p} />
      </div>
      <div className="name">{tx(p.nombre, lang)}</div>
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

  const hoverYSonido = (id) => {
    setHover(id);
    if (id) onSound?.(id);
  };

  const fila = (n) => PROYECTOS.filter((p) => p.fila === n);
  const marca = (p) => filtro !== "todas" && !p.industrias.includes(filtro);
  const brilla = (p) => filtro !== "todas" && p.industrias.includes(filtro);

  return (
    <section className="escenario" id="proyectos" aria-label={ui.nav.proyectos}>
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
            <span className="count">{fila(n).filter((p) => sellos.includes(p.id)).length}/{fila(n).length} 🍄</span>
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
