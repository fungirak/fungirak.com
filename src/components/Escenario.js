"use client";
import { useEffect, useRef, useState } from "react";
import { fondoDe } from "@/data/cards-fondo";
import { PROYECTOS, INDUSTRIAS, ORDEN, ORDEN_FILAS } from "@/data/proyectos";
import { useLang, tx } from "@/lib/i18n";
import { Casa, Llave, Persona } from "./Iconos";
import Micelio from "./Micelio";

// Una fila de cards que se desliza de costado. En la compu suma flechas a los costados (el celu se desliza con el dedo);
// cada flecha se esconde cuando ya no hay más cards de ese lado.
function Riel({ children, es }) {
  const pista = useRef(null);
  const [borde, setBorde] = useState({ ini: true, fin: true });
  useEffect(() => {
    const n = pista.current;
    if (!n) return;
    const medir = () => setBorde({ ini: n.scrollLeft <= 4, fin: n.scrollLeft + n.clientWidth >= n.scrollWidth - 4 });
    medir();
    n.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(n);
    return () => { n.removeEventListener("scroll", medir); ro.disconnect(); };
  }, []);
  const mover = (d) => pista.current?.scrollBy({ left: d * Math.max(260, pista.current.clientWidth * 0.8), behavior: "smooth" });
  return (
    <div className="riel">
      <button type="button" className="riel-flecha prev" aria-label={es ? "Ver anteriores" : "Previous"} disabled={borde.ini} onClick={() => mover(-1)}>‹</button>
      <div ref={pista} className="cards">{children}</div>
      <button type="button" className="riel-flecha next" aria-label={es ? "Ver más" : "More"} disabled={borde.fin} onClick={() => mover(1)}>›</button>
    </div>
  );
}

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
  const iniciales = { mitour: "✈", ecos: "📡", atalaya: "🛡️", atlas: "💪", gourmet: "☕", schools: "🏫", telos: "🌙", negro: "🌲", peyote: "🌵", loquero: "🩺", mate: "🧉", asador: "🔥", micoteca: "🍄", musgui: "🌿", sinvueltas: "📋", surco: "🌱", fabrica: "🏭", dertin: "⚡", cronicas: "🚀", tribus: "🤘", hoy: "☀", cv: "✎", preguntas: "?", escanea: "⌗", pasalo: "⇄", termometro: "°", rinde: "$", "que-hago-hoy": "♪", "escuela-del-pescador": "~", "escuela-de-mascotas": "♥", "primeros-auxilios": "+", "trivia": "?", "figus": "★", "voluntarios": "✋", "prode": "⚽", "afinados": "♪", "santafe-oculta": "◐", "carta-al-futuro": "✉" }[p.id];
  return <div className="monogram" aria-hidden="true">{iniciales}</div>;
}

function Card({ p, onOpen, sellado, dim, lit, onHover, idx, likes = 0 }) {
  const { lang } = useLang();
  const fondo = fondoDe(p.id);
  return (
    <button
      className={`card${p.fila >= 2 ? " con-pills" : ""}${p.id === "teamjoy" ? " teamjoy" : ""}${dim ? " dim" : ""}${lit ? " lit" : ""}${likes > 0 ? " con-likes" : ""}${fondo ? (fondo.tono ? " con-fondo" : " con-fondo blanco") : ""}`}
      style={{ "--c": fondo?.tono || p.color, "--i": idx, ...(fondo && { "--tapiz": fondo.tapiz }) }}
      data-card={p.id}
      onClick={() => onOpen(p.id)}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(p.id)}
      onBlur={() => onHover(null)}
    >
      {fondo && <span className="card-fondo" aria-hidden="true"><span /></span>}
      {p.badge && <span className="badge">{tx(p.badge, lang)}</span>}
      {sellado && <span className="stamped" title="✓">✓</span>}
      {likes > 0 && <span className="card-likes" title={lang === "es" ? "Aplausos y me gusta de sus historias" : "Claps and story likes"}>❤️ {likes}</span>}
      <div className="art">
        <Arte p={p} />
      </div>
      <div className={`name${tx(p.nombre, lang).length > 22 ? " largo" : ""}`}>{tx(p.nombre, lang)}</div>
      <div className="tag">{tx(p.tagline, lang)}</div>
      {p.fila >= 2 && (
        <div className="pills">
          {p.pills.slice(0, 3).map((x) => (
            <span key={x} className={`pill${x === "+18" ? " adult" : ""}`}>{x}</span>
          ))}
        </div>
      )}
    </button>
  );
}

export default function Escenario({ onOpen, sellos, onSound, aplausos = {} }) {
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

  const pos = (p) => { const k = ORDEN.indexOf(p.id); return k < 0 ? 99 : k; };
  const enFila = (n, p) => { const k = (ORDEN_FILAS[n - 1] || []).indexOf(p.id); return k < 0 ? 99 + pos(p) : k; }; // el orden elegido para cada fila
  const fila = (n) => PROYECTOS.filter((p) => p.fila === n).sort((a, b) => enFila(n, a) - enFila(n, b));
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

      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div className="fila" key={n}>
          <div className="fila-head">
            <h2 className="display">{ui[`fila${n}`]}</h2>
            <span className="count" title={lang === "es" ? "Cada card que abrís te da un sello en tu Pasaporte FUNGIRAK" : "Every card you open gives you a stamp in your FUNGIRAK Passport"}>
              ✓ {lang === "es" ? "Abriste" : "Opened"} {fila(n).filter((p) => sellos.includes(p.id)).length} {lang === "es" ? "de" : "of"} {fila(n).length}
            </span>
          </div>
          <Riel es={lang === "es"}>
            {fila(n).map((p, idx) => (
              <Card key={p.id} p={p} idx={idx + [1, 2, 3].filter((k) => k < n).reduce((t, k) => t + fila(k).length, 0)} onOpen={onOpen} sellado={sellos.includes(p.id)} dim={marca(p)} lit={brilla(p)} onHover={hoverYSonido} likes={aplausos?.[p.id] || 0} />
            ))}
          </Riel>
        </div>
      ))}
    </section>
  );
}
