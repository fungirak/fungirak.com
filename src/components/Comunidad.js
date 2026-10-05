"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { EMOJIS } from "@/lib/moderacion";
import { useFiltro, AvisoFiltro, claseFiltro } from "./Filtro";
import { avisarPorMail } from "@/lib/avisoMail";

const ERRORES = {
  es: { links: "Sin links ni @usuarios, porfa 🙏", lenguaje: "Mantengámoslo family friendly 💚", gritos: "No hace falta gritar 😅", spam: "Eso parece spam 🤖", corto: "Escribí un poquito más", limite: "Ya dejaste varias, ¡gracias! Volvé en un rato", error: "No se pudo publicar, probá de nuevo" },
  en: { links: "No links or @handles, please 🙏", lenguaje: "Let's keep it family friendly 💚", gritos: "No need to shout 😅", spam: "That looks like spam 🤖", corto: "Write a bit more", limite: "You've left several already, thanks! Come back later", error: "Couldn't post, try again" },
};

function hace(fecha, lang) {
  const s = Math.max(1, Math.round((Date.now() - new Date(fecha).getTime()) / 1000));
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  if (s < 60) return rtf.format(-s, "second");
  if (s < 3600) return rtf.format(-Math.round(s / 60), "minute");
  if (s < 86400) return rtf.format(-Math.round(s / 3600), "hour");
  return rtf.format(-Math.round(s / 86400), "day");
}

function Formulario({ tipo, onPublicado, placeholder, max, boton, onSello }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [emoji, setEmoji] = useState(tipo === "idea" ? "🚀" : "🍄");
  const [texto, setTexto] = useState("");
  const [nombre, setNombre] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [hp, setHp] = useState("");
  const [estado, setEstado] = useState(null);
  const malas = useFiltro(texto, anonimo ? "" : nombre);

  const enviar = async (e) => {
    e.preventDefault();
    if (malas.length || estado === "enviando") return;
    setEstado("enviando");
    try {
      const r = await fetch("/api/muro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, emoji, texto, nombre: anonimo ? "" : nombre, _hp: hp }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok && j.item) {
        if (tipo === "idea") avisarPorMail(`💡 fungirak.com · Idea de sitio #${j.item.id}`, { Idea: j.item.texto, Firma: j.item.nombre || "Anónimo", Icono: j.item.emoji });
        onPublicado(j.item);
        setTexto("");
        setEstado("ok");
        onSello?.();
        setTimeout(() => setEstado(null), 2500);
      } else setEstado(j.error || "error");
    } catch {
      setEstado("error");
    }
  };

  return (
    <form onSubmit={enviar} className="muro-form">
      <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} />
      <div className="emoji-pick" role="radiogroup" aria-label={es ? "Elegí tu ícono" : "Pick your icon"}>
        {EMOJIS.map((x) => (
          <button type="button" key={x} role="radio" aria-checked={emoji === x} className={emoji === x ? "on" : ""} onClick={() => setEmoji(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="campo">
        <textarea className={claseFiltro(texto)} value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={max} placeholder={placeholder} required aria-label={placeholder} aria-invalid={malas.length > 0} />
        <small style={{ textAlign: "right", color: "var(--text-3)" }}>{texto.length}/{max}</small>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {!anonimo && <input className={`firma ${claseFiltro(nombre) || ""}`} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={30} placeholder={es ? "Tu firma" : "Your signature"} aria-label={es ? "Tu firma" : "Your signature"} />}
        <label className="anonimo">
          <input type="checkbox" checked={anonimo} onChange={(e) => setAnonimo(e.target.checked)} /> {es ? "Anónimo 🕶️" : "Anonymous 🕶️"}
        </label>
        <button className="btn" disabled={estado === "enviando" || texto.trim().length < 3 || malas.length > 0} style={{ marginLeft: "auto" }}>
          {emoji} {estado === "enviando" ? "…" : boton}
        </button>
      </div>
      <AvisoFiltro palabras={malas} />
      {estado && estado !== "enviando" && <p className={`aviso ${estado === "ok" ? "ok" : "err"}`} style={{ marginTop: 10 }}>{estado === "ok" ? (es ? "¡Listo! Ya es parte del micelio 🍄" : "Done! It's now part of the mycelium 🍄") : ERRORES[lang][estado] || ERRORES[lang].error}</p>}
    </form>
  );
}

// Ícono de info con la definición de micelio (hover, foco o toque)
function InfoMicelio({ es }) {
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState(null);
  // Ubica el globo siempre dentro de la pantalla: hacia la derecha del ícono si entra, si no, lo corre lo justo
  const ubicar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ancho = Math.min(320, window.innerWidth - 32);
    const izq = Math.min(Math.max(16, r.left - 12), window.innerWidth - ancho - 16);
    setPos({ top: r.bottom + 10, left: izq, width: ancho });
  };
  return (
    <button
      type="button"
      className="info-tip"
      aria-expanded={abierto}
      aria-label={es ? "¿Qué es el micelio?" : "What is mycelium?"}
      onClick={(e) => {
        ubicar(e);
        setAbierto((a) => !a);
      }}
      onMouseEnter={ubicar}
      onFocus={ubicar}
      onBlur={() => setAbierto(false)}
    >
      i
      <span className="tip" role="tooltip" style={pos ? { position: "fixed", top: pos.top, left: pos.left, right: "auto", width: pos.width } : undefined}>
        {es ? (
          <>
            <b>Micelio:</b> la red de filamentos de los hongos (las hifas) que crece bajo tierra e interconecta raíces de plantas y árboles. Por ella circulan agua, nutrientes y señales: el &ldquo;internet&rdquo; del bosque.
          </>
        ) : (
          <>
            <b>Mycelium:</b> the network of fungal filaments (hyphae) that grows underground and links the roots of plants and trees. Water, nutrients and signals travel through it: the forest&apos;s &ldquo;internet&rdquo;.
          </>
        )}
      </span>
    </button>
  );
}

export default function Comunidad({ muro, setMuro, sellar }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [votadas, setVotadas] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fgk-votos") || "[]");
    } catch {
      return [];
    }
  });
  const [reportadas, setReportadas] = useState([]);

  const accion = async (id, a) => {
    if (a === "votar") {
      if (votadas.includes(id)) return;
      const nuevas = [...votadas, id].slice(-300);
      setVotadas(nuevas);
      try {
        localStorage.setItem("fgk-votos", JSON.stringify(nuevas));
      } catch {}
      setMuro((m) => ({ ...m, ideas: m.ideas.map((x) => (x.id === id ? { ...x, votos: x.votos + 1 } : x)).sort((p, q) => q.votos - p.votos) }));
    } else {
      if (reportadas.includes(id)) return;
      setReportadas((v) => [...v, id]);
    }
    fetch("/api/muro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accion: a, id }) }).catch(() => {});
  };

  // Si se hace scroll con el globo abierto, se cierra (para que no quede flotando en otro lugar)
  useEffect(() => {
    const cerrar = () => document.activeElement?.classList?.contains("info-tip") && document.activeElement.blur();
    window.addEventListener("scroll", cerrar, { passive: true });
    return () => window.removeEventListener("scroll", cerrar);
  }, []);

  const huellas = muro.huellas.filter((h) => !reportadas.includes(h.id));
  const ideas = muro.ideas.filter((h) => !reportadas.includes(h.id));

  return (
    <section className="band" id="comunidad" aria-labelledby="com-t">
      <div className="wrap">
        <div className="eyebrow">{es ? "Comunidad" : "Community"} 🫶</div>
        <h2 className="display" id="com-t" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", margin: "8px 0 6px" }}>
          {es ? <>Dejá tu <span className="grad-text">huella</span> en mi-celio</> : <>Leave your <span className="grad-text">mark</span> on my-celium</>}
          <InfoMicelio es={es} />
        </h2>
        <p style={{ color: "var(--text-2)", maxWidth: 680, marginTop: 0 }}>
          {es
            ? "Un saludo, un consejo, una buena onda, firmado o anónimo. El ícono que elijas decora el marco de mi tarjeta de perfil. Y si tenés una idea de sitio que te gustaría ver hecha, proponela: las más votadas son candidatas a que las construya y las muestre acá."
            : "A greeting, some advice, good vibes, signed or anonymous. The icon you pick decorates the frame of my profile card. And if there's a site you'd love to see built, pitch it: the most voted ones are candidates for me to build and showcase here."}
        </p>

        <div className="muro-grid">
          <div className="muro-col">
            <h3 className="display">👣 {es ? "Dejá tu huella" : "Leave your mark"}</h3>
            <Formulario tipo="huella" max={180} placeholder={es ? "¿Qué me querés decir?" : "What would you like to tell me?"} boton={es ? "Dejar huella" : "Leave mark"} onPublicado={(it) => setMuro((m) => ({ ...m, huellas: [it, ...m.huellas] }))} onSello={() => sellar("huella")} />
            {huellas.length === 0 && <p className="aviso">{es ? "Todavía no hay huellas. ¡Estrená el muro!" : "No marks yet. Be the first!"}</p>}
            <div className="huellas">
              {huellas.map((h, i) => (
                <article key={h.id} className="huella" style={{ animationDelay: `${Math.min(i, 12) * 0.04}s`, "--rot": `${((h.id * 37) % 7) - 3}deg` }}>
                  <span className="huella-emoji">{h.emoji}</span>
                  <p>{h.texto}</p>
                  <footer>
                    <span>— {h.nombre || (es ? "Anónimo" : "Anonymous")} · {hace(h.creado, lang)}</span>
                    <button onClick={() => accion(h.id, "reportar")} aria-label={es ? "Reportar" : "Report"} title={es ? "Reportar" : "Report"}>⚑</button>
                  </footer>
                </article>
              ))}
            </div>
          </div>

          <div className="muro-col">
            <h3 className="display">💡 {es ? "Pedime un sitio" : "Pitch me a site"}</h3>
            <Formulario tipo="idea" max={280} placeholder={es ? "Me gustaría que hagas un sitio de…" : "I'd love you to build a site about…"} boton={es ? "Proponer" : "Pitch it"} onPublicado={(it) => setMuro((m) => ({ ...m, ideas: [...m.ideas, it] }))} onSello={() => sellar("idea")} />
            <ol className="ideas">
              {ideas.length === 0 && <p className="aviso">{es ? "Ninguna idea todavía. ¿Qué sitio te falta en el mundo?" : "No ideas yet. What site is the world missing?"}</p>}
              {ideas.map((x, i) => (
                <li key={x.id} className={`idea${i < 3 ? " top" : ""}`}>
                  <button className={`voto${votadas.includes(x.id) ? " on" : ""}`} onClick={() => accion(x.id, "votar")} aria-label={es ? "Votar" : "Vote"}>
                    ▲<b>{x.votos}</b>
                  </button>
                  <div>
                    <p>{x.emoji} {x.texto}</p>
                    <small>
                      {i < 3 && <span className="pill live" style={{ marginRight: 6 }}>{es ? "Candidata" : "Candidate"}</span>}
                      {x.nombre || (es ? "Anónimo" : "Anonymous")} · {hace(x.creado, lang)}
                      <button onClick={() => accion(x.id, "reportar")} aria-label={es ? "Reportar" : "Report"} className="rep">⚑</button>
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
