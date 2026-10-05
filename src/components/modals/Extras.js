"use client";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { useLang, tx } from "@/lib/i18n";
import { SELLOS, NIVELES, nivelDe } from "@/lib/pasaporte";
import { PROYECTOS, proyecto } from "@/data/proyectos";
import { LINKS, PERFIL, SKILLS, VIDEO, FILOSOFIA } from "@/data/perfil";
import { Instagram as IgIcon } from "../Iconos";

/* ---------------- Pasaporte ---------------- */
export function Pasaporte({ onClose, sellos, visitante, abrir }) {
  const { lang, ui } = useLang();
  const es = lang === "es";
  const n = sellos.length;
  const nivel = nivelDe(n);
  const prox = NIVELES.find((l) => l.min > n);
  const completo = n >= SELLOS.length;
  const faltan = SELLOS.filter((s) => !sellos.includes(s.id));
  return (
    <Modal onClose={onClose} wide color="#00c853" eyebrow={es ? "Pasaporte FUNGIRAK" : "FUNGIRAK Passport"} titulo={`${nivel.icono} ${ui.nivel}: ${tx(nivel, lang)}`} bajada={prox ? (es ? `Te faltan ${prox.min - n} sellos para ser ${prox.es}.` : `${prox.min - n} stamps to become ${prox.en}.`) : es ? "¡Llegaste al nivel máximo!" : "You reached the top level!"}>
      <div className="modal-body">
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.85rem" }}>
          <span>{n} / {SELLOS.length} {es ? "sellos" : "stamps"}</span>
          <span>{Math.round((n / SELLOS.length) * 100)}%</span>
        </div>
        <div className="barra"><i style={{ width: `${(n / SELLOS.length) * 100}%` }} /></div>

        {completo && (
          <div className="resultado" style={{ marginBottom: 18, textAlign: "center" }}>
            <div style={{ fontSize: "3rem" }}>🌳🍄🌳</div>
            <b className="display" style={{ fontSize: "1.3rem" }}>
              {es ? `${visitante?.nombre || "Explorador/a"}, recorriste todo el micelio` : `${visitante?.nombre || "Explorer"}, you walked the whole mycelium`}
            </b>
            <p>{es ? "Sos de las pocas personas que lo completaron. Te ganaste mirar \"No Limits\" con sonido y, sobre todo, una charla conmigo." : "You're one of the few who completed it. You've earned watching \"No Limits\" with sound and, above all, a chat with me."}</p>
            <div className="acciones" style={{ justifyContent: "center" }}>
              <a className="btn violet" href={`https://www.youtube.com/watch?v=${VIDEO.id}`} target="_blank" rel="noopener noreferrer">🎬 No Limits</a>
              <button className="btn" onClick={() => abrir("hablemos")}>👋 {es ? "Reclamar mi charla" : "Claim my chat"}</button>
            </div>
          </div>
        )}

        <div className="sellos">
          {SELLOS.map((s) => {
            const ok = sellos.includes(s.id);
            return (
              <div key={s.id} className={`sello-item${ok ? " ok" : ""}`} title={tx(s, lang)}>
                <div>
                  <div className="ico">{s.icono}</div>
                  {ok ? tx(s, lang) : "?"}
                </div>
              </div>
            );
          })}
        </div>

        {!completo && (
          <p style={{ fontSize: "0.85rem", marginTop: 18 }}>
            💡 {es ? "Pista: " : "Hint: "}
            {faltan[0]?.id === "acorde"
              ? es ? "activá el modo músico 🎹 y pasá por las 5 cards centrales." : "turn on musician mode 🎹 and hover the 5 core cards."
              : faltan[0]?.id === "terminal"
                ? es ? "apretá Ctrl+K (o tocá «Terminal» en el pie de página)." : "press Ctrl+K (or tap «Terminal» in the footer)."
                : es ? `buscá «${tx(faltan[0], lang)}».` : `look for «${tx(faltan[0], lang)}».`}
          </p>
        )}
      </div>
    </Modal>
  );
}

/* ---------------- Terminal (Ctrl+K) ---------------- */
export function Terminal({ onClose, abrir, setTema, setLang, tema }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [lineas, setLineas] = useState(() => [
    { t: es ? "fungirak OS v2026 · escribí «help» para ver los comandos" : "fungirak OS v2026 · type «help» to see commands", c: "#8b93b8" },
  ]);
  const [v, setV] = useState("");
  const [hist, setHist] = useState([]);
  const [hi, setHi] = useState(-1);
  const fin = useRef(null);
  useEffect(() => {
    fin.current?.scrollIntoView({ block: "end" });
  }, [lineas]);

  const salida = (cmd) => {
    const [c, ...args] = cmd.trim().toLowerCase().split(/\s+/);
    const pro = PROYECTOS.filter((p) => p.url);
    switch (c) {
      case "help":
      case "ayuda":
        return "about · projects · open <id> · stack · contact · cv · vcard · philosophy · passport · play · theme · lang · github · clear · exit\n" + (es ? "…y algún comando secreto 👀" : "…and a secret command or two 👀");
      case "about":
      case "whoami":
        return `${PERFIL.nombre} (@${PERFIL.alias}) · ${tx(PERFIL.rol, lang)}\n${tx(PERFIL.subrol, lang)}\n${PERFIL.ciudad}`;
      case "projects":
      case "ls":
        return pro.map((p) => `${p.id.padEnd(9)} ${tx(p.nombre, lang).padEnd(18)} ${p.url}`).join("\n");
      case "open": {
        const p = proyecto(args[0]);
        if (!p) return es ? "No existe. Probá «projects»." : "Not found. Try «projects».";
        setTimeout(() => abrir(`proyecto:${p.id}`), 300);
        return `→ ${tx(p.nombre, lang)}`;
      }
      case "stack":
        return SKILLS.map((g) => `${tx(g.grupo, lang)}: ${g.items.join(", ")}`).join("\n");
      case "contact":
        return `email    ${LINKS.email}\nwhatsapp ${LINKS.whatsappVisible}\nlinkedin ${LINKS.linkedin}\ngithub   ${LINKS.github}`;
      case "cv":
        window.open("/cv", "_blank");
        return es ? "Abriendo el CV…" : "Opening CV…";
      case "vcard":
        window.open("/api/vcard", "_self");
        return es ? "Descargando contacto…" : "Downloading contact…";
      case "philosophy":
      case "filosofia":
        return `"${tx(FILOSOFIA.frase, lang)}"`;
      case "passport":
      case "pasaporte":
        setTimeout(() => abrir("pasaporte"), 300);
        return "→ 🛂";
      case "play":
      case "jugar":
        setTimeout(() => abrir("juego"), 300);
        return "→ 🎮 ESPORA";
      case "github":
        setTimeout(() => abrir("github"), 300);
        return "→ 🐙";
      case "theme":
        setTema(tema === "dark" ? "light" : "dark");
        return es ? "Tema cambiado ✨" : "Theme switched ✨";
      case "lang":
        setLang(lang === "es" ? "en" : "es");
        return lang === "es" ? "Language: English 🌎" : "Idioma: español 🇦🇷";
      case "sudo":
        if (args.join(" ").includes("hire")) {
          setTimeout(() => abrir("hablemos", { interes: "contratar" }), 600);
          return es ? "[sudo] contraseña aceptada: buena decisión 😎 Abriendo contacto…" : "[sudo] password accepted: good call 😎 Opening contact…";
        }
        return es ? "Permiso denegado. Probá «sudo hire gabriel»." : "Permission denied. Try «sudo hire gabriel».";
      case "fungi":
      case "🍄":
        return "      .-'~~~'-.\n    .'  o   o  '.\n   :  o   o   o :\n    '-.._____..-'\n         |  |\n   ~~~~~~|  |~~~~~~  micelio online";
      case "coffee":
      case "mate":
        return es ? "🧉 Cebando un mate… listo. Ahora sí, a programar." : "🧉 Brewing a mate… done. Now let's code.";
      case "clear":
        setLineas([]);
        return null;
      case "exit":
        onClose();
        return null;
      case "":
        return null;
      default:
        return es ? `comando no encontrado: ${c}. Escribí «help».` : `command not found: ${c}. Type «help».`;
    }
  };

  const enviar = (e) => {
    e.preventDefault();
    const out = salida(v);
    if (v.trim().toLowerCase() !== "clear") setLineas((l) => [...l, { t: `fungirak@studio:~$ ${v}`, c: "#00e676" }, ...(out ? [{ t: out }] : [])]);
    if (v.trim()) setHist((h) => [v, ...h]);
    setHi(-1);
    setV("");
  };

  return (
    <Modal onClose={onClose} wide head={false} label={es ? "Terminal" : "Terminal"}>
      <div className="term-bar"><i /><i /><i /><span style={{ marginLeft: 8 }}>fungirak@studio — zsh</span></div>
      <div className="term" onClick={() => document.getElementById("term-in")?.focus()}>
        {lineas.map((l, i) => <pre key={i} style={l.c ? { color: l.c } : undefined}>{l.t}</pre>)}
        <form onSubmit={enviar}>
          <span className="prompt">fungirak@studio:~$ </span>
          <input
            id="term-in"
            value={v}
            onChange={(e) => setV(e.target.value)}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            aria-label="Comando"
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && hist.length) {
                const k = Math.min(hi + 1, hist.length - 1);
                setHi(k);
                setV(hist[k]);
                e.preventDefault();
              }
              if (e.key === "ArrowDown") {
                const k = Math.max(hi - 1, -1);
                setHi(k);
                setV(k < 0 ? "" : hist[k]);
                e.preventDefault();
              }
            }}
          />
        </form>
        <div ref={fin} />
      </div>
    </Modal>
  );
}

/* ---------------- Quiz: ¿Qué puedo construir para vos? ---------------- */
const Q = [
  {
    id: "rubro",
    es: "¿De qué rubro es tu idea?",
    en: "What field is your idea in?",
    ops: [
      { id: "publico", ico: "🏛️", es: "Sector público", en: "Public sector" },
      { id: "educacion", ico: "🎓", es: "Educación", en: "Education" },
      { id: "comercio", ico: "☕", es: "Comercio o gastronomía", en: "Retail or food" },
      { id: "salud", ico: "💪", es: "Salud y bienestar", en: "Health & wellness" },
      { id: "turismo", ico: "✈️", es: "Turismo o ciudad", en: "Travel or city" },
      { id: "cultura", ico: "🎸", es: "Música y cultura", en: "Music & culture" },
      { id: "otro", ico: "✨", es: "Otra cosa", en: "Something else" },
    ],
  },
  {
    id: "objetivo",
    es: "¿Qué querés lograr?",
    en: "What do you want to achieve?",
    ops: [
      { id: "encontrar", ico: "🔎", es: "Que me encuentren", en: "Be found" },
      { id: "ordenar", ico: "🗂️", es: "Ordenar procesos", en: "Organize processes" },
      { id: "comunidad", ico: "🫂", es: "Armar comunidad", en: "Build community" },
      { id: "cobrar", ico: "💳", es: "Vender o cobrar", en: "Sell or get paid" },
      { id: "wow", ico: "🤯", es: "Algo nunca visto", en: "Something never seen" },
    ],
  },
  {
    id: "plataforma",
    es: "¿Dónde lo imaginás?",
    en: "Where do you picture it?",
    ops: [
      { id: "web", ico: "🌐", es: "En la web", en: "On the web" },
      { id: "app", ico: "📱", es: "Como app en el celu", en: "As a phone app" },
      { id: "ambas", ico: "🔀", es: "Las dos", en: "Both" },
      { id: "nose", ico: "🤷", es: "No sé, ayudame", en: "Not sure, help me" },
    ],
  },
];

const RECO = {
  encontrar: { es: "Un sitio veloz, bilingüe y optimizado para Google, con buscador y fichas claras.", en: "A fast, bilingual site optimized for Google, with search and clear listings.", prueba: { publico: "schools", educacion: "schools", comercio: "gourmet", turismo: "telos", otro: "gourmet" } },
  ordenar: { es: "Un sistema a medida con usuarios, roles y datos seguros, como los que construyo en el Estado.", en: "A custom system with users, roles and secure data, like the ones I build in government.", prueba: { publico: "problematica" } },
  comunidad: { es: "Una plataforma social con perfiles, eventos y gamificación para que la gente vuelva.", en: "A social platform with profiles, events and gamification so people come back.", prueba: {} },
  cobrar: { es: "Una experiencia con pagos integrados (Mercado Pago) y paneles para seguir cada venta.", en: "An experience with integrated payments (Mercado Pago) and dashboards to track every sale.", prueba: {} },
  wow: { es: "Algo interactivo de verdad: 3D, mapas animados, sonido o datos en vivo.", en: "Something truly interactive: 3D, animated maps, sound or live data.", prueba: { turismo: "mitour", cultura: "negro", salud: "atlas" } },
};

export function Quiz({ onClose, abrir, onListo }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [r, setR] = useState({});
  const paso = Object.keys(r).length;
  const fin = paso >= Q.length;

  useEffect(() => {
    if (fin) onListo?.();
  }, [fin, onListo]);

  let reco, prueba;
  if (fin) {
    reco = RECO[r.objetivo];
    const porRubro = { salud: "atlas", turismo: "mitour", cultura: "negro", educacion: "schools", comercio: "gourmet", publico: "teamjoy" };
    const porObj = { comunidad: "teamjoy", cobrar: "teamjoy", wow: "ecos" };
    prueba = proyecto(reco.prueba[r.rubro] || porObj[r.objetivo] || porRubro[r.rubro] || "mitour");
  }
  const plat = { web: es ? "web responsive" : "responsive web", app: es ? "app instalable (PWA o nativa)" : "installable app (PWA or native)", ambas: es ? "web + app" : "web + app", nose: es ? "lo definimos juntos según tu público" : "we'll decide together based on your audience" }[r.plataforma];
  const resumen = fin ? `${es ? "Hice el quiz" : "I took the quiz"}: ${Q.map((q) => tx(q.ops.find((o) => o.id === r[q.id]), lang)).join(" · ")}` : "";

  return (
    <Modal onClose={onClose} color="#8b5cf6" eyebrow={es ? "Laboratorio FUNGIRAK" : "FUNGIRAK Lab"} titulo={es ? "¿Qué puedo construir para vos?" : "What can I build for you?"} bajada={es ? "Tres preguntas, treinta segundos." : "Three questions, thirty seconds."}>
      <div className="modal-body">
        <div className="wizard-steps" aria-hidden="true">{Q.map((q, i) => <span key={q.id} className={i < paso ? "on" : ""} />)}</div>
        {!fin ? (
          <>
            <h3 style={{ marginTop: 0 }}>{tx(Q[paso], lang)}</h3>
            <div className="opciones" key={paso}>
              {Q[paso].ops.map((o, i) => (
                <button key={o.id} className="opcion" style={{ animation: `rise .4s ${i * 0.05}s both` }} onClick={() => setR({ ...r, [Q[paso].id]: o.id })}>
                  <span className="ico">{o.ico}</span>
                  <b>{tx(o, lang)}</b>
                </button>
              ))}
            </div>
            {paso > 0 && <button className="btn ghost small" style={{ marginTop: 14 }} onClick={() => { const c = { ...r }; delete c[Q[paso - 1].id]; setR(c); }}>← {es ? "Volver" : "Back"}</button>}
          </>
        ) : (
          <div className="resultado">
            <div className="eyebrow">{es ? "Mi propuesta" : "My proposal"} 🧪</div>
            <p className="cita" style={{ "--c": "#8b5cf6", marginTop: 8 }}>{tx(reco, lang)}</p>
            <p>📦 {es ? "Formato" : "Format"}: <b>{plat}</b></p>
            {prueba && (
              <p>
                🔬 {es ? "Prueba de que lo sé hacer:" : "Proof I can do it:"}{" "}
                <button onClick={() => abrir(`proyecto:${prueba.id}`)} style={{ background: "none", border: 0, padding: 0, color: "var(--accent)", fontWeight: 700, cursor: "pointer" }}>
                  {tx(prueba.nombre, lang)} →
                </button>
              </p>
            )}
            <div className="acciones">
              <button className="btn" onClick={() => abrir("brief", { brief: { rubro: r.rubro, objetivo: [{ encontrar: "encontrar", ordenar: "ordenar", comunidad: "comunidad", cobrar: "vender" }[r.objetivo]].filter(Boolean), plataforma: r.plataforma, idea: resumen } })}>🚀 {es ? "Quiero empezar" : "Let's start"}</button>
              <button className="btn ghost small" onClick={() => setR({})}>↺ {es ? "Probar otra idea" : "Try another idea"}</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ---------------- GitHub en vivo ---------------- */
const LANG_COLOR = { JavaScript: "#f1e05a", TypeScript: "#3178c6", Java: "#b07219", HTML: "#e34c26", CSS: "#563d7c", PHP: "#4F5D95", Python: "#3572A5", Vue: "#41b883" };

export function GitHub({ onClose }) {
  const { lang, ui } = useLang();
  const es = lang === "es";
  const [d, setD] = useState(null);
  useEffect(() => {
    fetch("/api/github").then((r) => r.json()).then(setD).catch(() => setD({ publicos: 0, lenguajes: [], recientes: [] }));
  }, []);
  const total = d?.lenguajes?.reduce((n, [, v]) => n + v, 0) || 1;
  const fecha = (s) => new Date(s).toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "short", year: "numeric" });
  return (
    <Modal onClose={onClose} color="#3b82f6" eyebrow={`GitHub · ${ui.enVivo}`} titulo="@fungirak" bajada={es ? "Datos en vivo desde la API pública de GitHub." : "Live data from GitHub's public API."}>
      <div className="modal-body">
        {!d ? (
          <p>⏳ {es ? "Consultando GitHub…" : "Asking GitHub…"}</p>
        ) : (
          <>
            <div className="datos">
              <div className="dato"><b>{d.publicos}</b><span>{ui.repos}</span></div>
              <div className="dato"><b>{d.lenguajes.length}</b><span>{es ? "lenguajes" : "languages"}</span></div>
              {d.desde && <div className="dato"><b>{new Date(d.desde).getFullYear()}</b><span>{es ? "en GitHub desde" : "on GitHub since"}</span></div>}
            </div>
            {d.lenguajes.length > 0 && (
              <>
                <div className="barra-lang">
                  {d.lenguajes.map(([l, v]) => <i key={l} style={{ width: `${(v / total) * 100}%`, background: LANG_COLOR[l] || "#8b93b8" }} title={l} />)}
                </div>
                <div className="stack" style={{ marginBottom: 14 }}>
                  {d.lenguajes.map(([l, v]) => <span key={l} className="pill"><span style={{ width: 8, height: 8, borderRadius: 4, background: LANG_COLOR[l] || "#8b93b8" }} />{l} · {v}</span>)}
                </div>
              </>
            )}
            <h3>🕒 {ui.ultimo}</h3>
            <div className="gh">
              {d.recientes.map((r) => (
                <a key={r.nombre} className="gh-repo" href={r.url} target="_blank" rel="noopener noreferrer">
                  <span><b>{r.nombre}</b><br /><small>{r.desc || r.lenguaje || ""}</small></span>
                  <small>{fecha(r.pushed)}</small>
                </a>
              ))}
            </div>
            <div className="acciones"><a className="btn blue" href={LINKS.github} target="_blank" rel="noopener noreferrer">{es ? "Ver perfil completo" : "See full profile"} ↗</a></div>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ---------------- Instagram ---------------- */
export function Instagram({ onClose }) {
  const { lang } = useLang();
  const es = lang === "es";
  return (
    <Modal onClose={onClose} color="#dd2a7b" eyebrow="Instagram" titulo={es ? "Seguime el día a día" : "Follow my day to day"} bajada={es ? "Lo que publico y lo que publica Team Joy." : "What I post and what Team Joy posts."}>
      <div className="modal-body">
        <div className="ig-cards">
          <a className="ig-card" href={LINKS.instagram} target="_blank" rel="noopener noreferrer">
            <img src="/img/hongo.svg" alt="" />
            <span><b>@fungirak</b><small>Gabriel · FUNGIRAK Studio</small></span>
            <IgIcon style={{ marginLeft: "auto" }} />
          </a>
          <a className="ig-card" href={LINKS.teamjoyInstagram} target="_blank" rel="noopener noreferrer">
            <img src="/img/teamjoy-logo.jpg" alt="" />
            <span><b>@teamjoy.app</b><small>Team Joy</small></span>
            <IgIcon style={{ marginLeft: "auto" }} />
          </a>
        </div>
      </div>
    </Modal>
  );
}


/* ---------------- YouTube en vivo ---------------- */
export function YouTube({ onClose }) {
  const { lang, ui } = useLang();
  const es = lang === "es";
  const [videos, setVideos] = useState(null);
  const [play, setPlay] = useState(null);
  useEffect(() => {
    fetch("/api/youtube").then((r) => r.json()).then((d) => setVideos(d.videos || [])).catch(() => setVideos([]));
  }, []);
  const fecha = (s) => new Date(s).toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { month: "short", year: "numeric" });
  return (
    <Modal onClose={onClose} wide color="#ff3d3d" eyebrow={`YouTube · ${ui.enVivo}`} titulo="@fungirak" bajada={es ? "Mis presentaciones y proyectos en video. Se actualiza solo cuando subo algo nuevo." : "My talks and projects on video. Updates itself whenever I upload."}>
      <div className="modal-body">
        {play && (
          <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 18, overflow: "hidden", marginBottom: 16, background: "#000" }}>
            <iframe src={`https://www.youtube-nocookie.com/embed/${play}?autoplay=1&rel=0`} title="YouTube" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
          </div>
        )}
        {!videos ? (
          <p>⏳ {es ? "Buscando videos…" : "Fetching videos…"}</p>
        ) : (
          <div className="yt-grid">
            {videos.map((v) => (
              <button key={v.id} className="yt" onClick={() => setPlay(v.id)} style={{ textAlign: "left", padding: 0, cursor: "pointer", font: "inherit", color: "inherit" }}>
                <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" />
                <div>
                  {v.titulo}
                  <small>{fecha(v.fecha)}{v.vistas ? ` · ${v.vistas.toLocaleString(lang)} ${es ? "vistas" : "views"}` : ""}</small>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="acciones"><a className="btn" href={LINKS.youtube} target="_blank" rel="noopener noreferrer" style={{ "--b": "#ff3d3d", "--bd": "#b91c1c", "--fg": "#fff" }}>▶ {es ? "Suscribirme al canal" : "Subscribe"}</a></div>
      </div>
    </Modal>
  );
}
