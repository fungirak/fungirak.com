"use client";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { useLang, tx } from "@/lib/i18n";
import { proyecto } from "@/data/proyectos";
import { BITACORA } from "@/data/bitacora";
import { avisarPorMail } from "@/lib/avisoMail";

// Secciones nuevas de la portada: Cómo trabajo · ¿Cuánto saldría? · Bitácora · Ruleta · El estudio en números.

// Aparece al entrar en pantalla (una vez)
function useVisto(umbral = 0.25) {
  const ref = useRef(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const n = ref.current;
    if (!n) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisto(true); io.disconnect(); } }, { threshold: umbral });
    io.observe(n);
    return () => io.disconnect();
  }, [umbral]);
  return [ref, visto];
}

function Cabeza({ ojo, titulo, bajada, id }) {
  return (
    <div className="sec-cabeza">
      <div className="eyebrow">{ojo}</div>
      <h2 className="display" id={id}>{titulo}</h2>
      {bajada && <p>{bajada}</p>}
    </div>
  );
}

// ---------- 1. Cómo trabajo ----------
const PASOS = [
  { ico: "💬", es: ["Me contás la idea", "Una charla o un formulario guiado. Sin tecnicismos: vos contás qué necesitás."], en: ["You tell me the idea", "A chat or a guided form. No jargon: you tell me what you need."] },
  { ico: "🧪", es: ["Prototipo en días", "Ves algo funcionando rápido y lo ajustamos juntos antes de seguir."], en: ["Prototype in days", "You see something working fast and we adjust it together."] },
  { ico: "🚀", es: ["Lanzamos", "Publicado, rápido, adaptado al celu y listo para que te encuentren en Google."], en: ["We launch", "Live, fast, mobile-ready and ready to be found on Google."] },
  { ico: "🌱", es: ["Lo cuidamos", "Mejoras, métricas y soporte para que siga creciendo con vos."], en: ["We look after it", "Improvements, metrics and support so it keeps growing with you."] },
];
export function ComoTrabajo({ abrir }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [ref, visto] = useVisto();
  return (
    <section className="band" id="como-trabajo" aria-labelledby="ct-t">
      <div className="wrap">
        <Cabeza id="ct-t" ojo={es ? "Cómo trabajo" : "How I work"}
          titulo={es ? <>De la idea a algo que funciona, <span className="grad-text">sin vueltas</span>.</> : <>From idea to something that works, <span className="grad-text">no fuss</span>.</>} />
        <ol ref={ref} className={`pasos ${visto ? "visto" : ""}`}>
          {PASOS.map((p, i) => (
            <li key={i} className="paso" style={{ "--i": i }}>
              <span className="paso-ico" aria-hidden="true">{p.ico}</span>
              <span className="paso-n">0{i + 1}</span>
              <b>{p[lang][0]}</b>
              <span>{p[lang][1]}</span>
            </li>
          ))}
        </ol>
        <div className="sec-cta"><button className="btn amber" onClick={() => abrir("brief")}>🚀 {es ? "Contame tu idea" : "Tell me your idea"}</button></div>
      </div>
    </section>
  );
}

// ---------- 2. ¿Cuánto saldría tu idea? ----------
// Orientativo: complejidad y plazo (sin precios publicados). Los ids coinciden con el formulario de pedido (Brief).
const TIPOS = {
  web: { ico: "🌐", es: "Sitio web", en: "Website", pts: 2, sem: [1, 2] },
  tienda: { ico: "🛍️", es: "Tienda online", en: "Online store", pts: 4, sem: [3, 4] },
  app: { ico: "📱", es: "App para el celu", en: "Phone app", pts: 6, sem: [4, 7] },
  sistema: { ico: "🗂️", es: "Sistema de gestión", en: "Management system", pts: 6, sem: [5, 8] },
};
const FUNCS = {
  login: { ico: "🔐", es: "Usuarios y login", en: "User accounts", pts: 2, sem: [0.5, 1] },
  pagos: { ico: "💳", es: "Pagos online", en: "Online payments", pts: 2, sem: [1, 1] },
  turnos: { ico: "📅", es: "Turnos o reservas", en: "Bookings", pts: 2, sem: [0.5, 1] },
  catalogo: { ico: "🗃️", es: "Catálogo", en: "Catalog", pts: 1, sem: [0.5, 1] },
  admin: { ico: "🧑‍💼", es: "Panel de admin", en: "Admin panel", pts: 2, sem: [1, 1.5] },
  mapa: { ico: "🗺️", es: "Mapa", en: "Map", pts: 1, sem: [0.5, 1] },
  idiomas: { ico: "🌍", es: "Varios idiomas", en: "Multiple languages", pts: 1, sem: [0.5, 0.5] },
  notif: { ico: "🔔", es: "Notificaciones", en: "Notifications", pts: 1, sem: [0.5, 1] },
  ia: { ico: "🧠", es: "Inteligencia artificial", en: "AI features", pts: 3, sem: [1, 2] },
  offline: { ico: "📴", es: "Sin internet", en: "Works offline", pts: 2, sem: [1, 1.5] },
};
const NIVELES = [
  { max: 4, simbolo: "$", es: "Inversión inicial", en: "Starter budget" },
  { max: 9, simbolo: "$$", es: "Inversión media", en: "Mid budget" },
  { max: 99, simbolo: "$$$", es: "Proyecto a medida", en: "Custom project" },
];
// Número que se anima hasta su valor
function Animado({ valor }) {
  const [v, setV] = useState(valor);
  const desde = useRef(valor);
  useEffect(() => {
    const ini = desde.current, t0 = performance.now();
    let raf;
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / 450);
      setV(Math.round(ini + (valor - ini) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(paso); else desde.current = valor;
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [valor]);
  return <>{v}</>;
}
export function Calculadora({ abrir }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [tipo, setTipo] = useState("web");
  const [funcs, setFuncs] = useState(["admin"]);
  const t = TIPOS[tipo];
  const pts = t.pts + funcs.reduce((a, f) => a + FUNCS[f].pts, 0);
  const sem = funcs.reduce((a, f) => [a[0] + FUNCS[f].sem[0], a[1] + FUNCS[f].sem[1]], t.sem).map(Math.round);
  const nivel = NIVELES.find((n) => pts <= n.max);
  const toggle = (f) => setFuncs((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]));
  return (
    <section className="band" id="calculadora" aria-labelledby="calc-t">
      <div className="wrap">
        <Cabeza id="calc-t" ojo={es ? "Calculadora" : "Estimator"}
          titulo={es ? <>¿Cuánto saldría <span className="grad-text">tu idea</span>?</> : <>What would <span className="grad-text">your idea</span> take?</>}
          bajada={es ? "Jugá con las opciones y mirá cómo cambian el plazo y la complejidad. Después pedime el presupuesto exacto." : "Play with the options and see how time and complexity change. Then ask me for an exact quote."} />
        <div className="calc">
          <div className="calc-opciones">
            <small className="calc-lbl">{es ? "¿Qué querés hacer?" : "What do you want to build?"}</small>
            <div className="calc-tipos" role="radiogroup">
              {Object.entries(TIPOS).map(([id, o]) => (
                <button key={id} role="radio" aria-checked={tipo === id} className={`calc-tipo ${tipo === id ? "on" : ""}`} onClick={() => setTipo(id)}><span>{o.ico}</span>{o[lang]}</button>
              ))}
            </div>
            <small className="calc-lbl">{es ? "¿Qué tiene que tener?" : "What should it have?"}</small>
            <div className="calc-funcs">
              {Object.entries(FUNCS).map(([id, o]) => (
                <button key={id} aria-pressed={funcs.includes(id)} className={`calc-func ${funcs.includes(id) ? "on" : ""}`} onClick={() => toggle(id)}>{o.ico} {o[lang]}</button>
              ))}
            </div>
          </div>
          <div className="calc-res" aria-live="polite">
            <small className="calc-lbl">{es ? "Plazo estimado" : "Estimated time"}</small>
            <div className="calc-sem"><b className="grad-text"><Animado valor={sem[0]} />–<Animado valor={sem[1]} /></b> {es ? "semanas" : "weeks"}</div>
            <small className="calc-lbl">{es ? "Complejidad" : "Complexity"}</small>
            <div className="calc-barra" role="meter" aria-valuemin={0} aria-valuemax={20} aria-valuenow={pts}><i style={{ width: `${Math.min(100, (pts / 20) * 100)}%` }} /></div>
            <div className="calc-nivel"><b>{nivel.simbolo}</b> {nivel[lang]}</div>
            <button className="btn" onClick={() => abrir("brief", { brief: { tipo, funciones: funcs } })}>{es ? "Pedir presupuesto exacto" : "Get an exact quote"} →</button>
            <small className="calc-nota">{es ? "Es orientativo: el número final depende de tu idea. El formulario ya va a tener lo que elegiste." : "It's a rough guide: the final number depends on your idea. The form will already have your picks."}</small>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- 3. Bitácora del estudio ----------
const EMOJI = { teamjoy: "🫂" };
export function Bitacora({ abrir }) {
  const { lang } = useLang();
  const es = lang === "es";
  const pista = useRef(null);
  const [ref, visto] = useVisto(0.2);
  const [borde, setBorde] = useState({ ini: false, fin: true });
  const fmt = (f) => new Date(`${f}-15T12:00:00`).toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { month: "short", year: "numeric" });
  useEffect(() => {
    const n = pista.current;
    if (!n) return;
    const upd = () => setBorde({ ini: n.scrollLeft < 4, fin: n.scrollLeft + n.clientWidth >= n.scrollWidth - 4 });
    upd();
    n.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => { n.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  }, []);
  // Recorrido automático: arranca desde el primer lanzamiento y avanza solo, despacio.
  // Se pausa si la persona pasa el mouse, toca o usa las flechas; al final espera y vuelve al principio.
  useEffect(() => {
    const n = pista.current;
    if (!n || !visto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf, pausa = 0, x = n.scrollLeft, ultimo = performance.now();
    const quieto = (ms) => { pausa = performance.now() + ms; x = n.scrollLeft; };
    const paso = (t) => {
      const dt = Math.min(50, t - ultimo);
      ultimo = t;
      if (t > pausa) {
        const fin = n.scrollWidth - n.clientWidth;
        if (x >= fin - 1) { quieto(2500); n.scrollTo({ left: 0, behavior: "smooth" }); setTimeout(() => { x = 0; }, 900); }
        else { x = Math.min(fin, x + dt * 0.035); n.scrollLeft = x; }
      }
      raf = requestAnimationFrame(paso);
    };
    const parar = () => quieto(4000);
    n.addEventListener("pointerenter", parar);
    n.addEventListener("pointerdown", parar);
    n.addEventListener("wheel", parar, { passive: true });
    n.addEventListener("touchstart", parar, { passive: true });
    n.addEventListener("focusin", parar);
    quieto(1200); // un respiro antes de arrancar
    raf = requestAnimationFrame(paso);
    return () => { cancelAnimationFrame(raf); ["pointerenter", "pointerdown", "wheel", "touchstart", "focusin"].forEach((e) => n.removeEventListener(e, parar)); };
  }, [visto]);
  const mover = (d) => { pista.current?.dispatchEvent(new Event("pointerdown")); pista.current?.scrollBy({ left: d * Math.max(240, pista.current.clientWidth * 0.7), behavior: "smooth" }); };
  return (
    <section className="band" id="bitacora" aria-labelledby="bit-t">
      <div className="wrap">
        <Cabeza id="bit-t" ojo={es ? "Bitácora del estudio" : "Studio log"}
          titulo={es ? <>Lo que fui <span className="grad-text">lanzando</span>.</> : <>What I&apos;ve been <span className="grad-text">shipping</span>.</>}
          bajada={es ? "Cada punto es un lanzamiento. Tocá uno para conocerlo." : "Each dot is a launch. Tap one to see it."} />
        <div ref={ref} className={`bit ${visto ? "visto" : ""}`}>
          <button className="bit-flecha prev" aria-label={es ? "Anterior" : "Previous"} disabled={borde.ini} onClick={() => mover(-1)}>‹</button>
          <div ref={pista} className="bit-pista">
            <ol className="bit-linea" style={{ "--n": BITACORA.length }}>
              {BITACORA.map((h, i) => {
                const p = proyecto(h.proyecto);
                if (!p) return null;
                const ultimo = i === BITACORA.length - 1;
                return (
                  <li key={i} className={`bit-hito ${i % 2 ? "abajo" : "arriba"} ${ultimo ? "ultimo" : ""}`} style={{ "--c": p.color, "--i": i }}>
                    <button className="bit-card" onClick={() => abrir(`proyecto:${p.id}`)}>
                      <span className="bit-logo">{p.logo ? <img src={p.logo} alt="" width={28} height={28} /> : EMOJI[p.id] || "✨"}</span>
                      <b>{tx(p.nombre, lang)}</b>
                      <span>{h[lang]}</span>
                    </button>
                    <span className="bit-punto" aria-hidden="true" />
                    <time className="bit-fecha" dateTime={h.fecha}>{fmt(h.fecha)}</time>
                  </li>
                );
              })}
            </ol>
          </div>
          <button className="bit-flecha next" aria-label={es ? "Siguiente" : "Next"} disabled={borde.fin} onClick={() => mover(1)}>›</button>
        </div>
      </div>
    </section>
  );
}

// ---------- 4. La ruleta del micelio ----------
// Sólo etiquetas: QUÉ sale y con qué probabilidad lo decide el servidor (/api/ruleta).
const GAJOS = ["d10", "nada", "d15", "otro", "sorteo", "nada", "d20", "otro"];
const ETIQ = {
  d10: { es: "10% OFF", en: "10% OFF", c: "var(--c-green)" },
  d15: { es: "15% OFF", en: "15% OFF", c: "var(--c-blue)" },
  d20: { es: "20% OFF", en: "20% OFF", c: "var(--c-rose)" },
  sorteo: { es: "Sitio gratis", en: "Free site", c: "var(--c-amber)" },
  otro: { es: "Otro giro", en: "Spin again", c: "var(--c-violet)" },
  nada: { es: "Esta vez no", en: "Not this time", c: "var(--c-navy)" },
};
const PREMIO_TXT = {
  d10: { es: "10% de descuento en tu proyecto", en: "10% off your project" },
  d15: { es: "15% de descuento en tu proyecto", en: "15% off your project" },
  d20: { es: "20% de descuento en tu proyecto", en: "20% off your project" },
  sorteo: { es: "Entrás al sorteo de un sitio web gratis", en: "You're in the free website giveaway" },
};
const leer = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const hoyAR = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
function dispositivo() {
  let d = leer("fgk-disp");
  if (!d) { d = (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`).replace(/[^\w-]/g, "").slice(0, 36); guardar("fgk-disp", d); }
  return d;
}

function Reclamo({ premio, token, onListo, onClose, es }) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState(() => leer("fgk-visitante")?.nombre || "");
  const [estado, setEstado] = useState(null);
  const [cupon, setCupon] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const ERR = {
    email: es ? "Revisá el email." : "Check your email.",
    "email-usado": es ? "Ese email ya ganó un premio este mes." : "That email already won this month.",
    "ya-reclamado": es ? "Este premio ya se reclamó." : "This prize was already claimed.",
    "giro-invalido": es ? "El premio venció. Girá de nuevo mañana." : "The prize expired. Spin again tomorrow.",
  };
  const enviar = async (e) => {
    e.preventDefault();
    setEstado("enviando");
    try {
      const r = await fetch("/api/ruleta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accion: "reclamar", token, email, nombre }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.codigo) return setEstado(j.error || "error");
      setCupon(j);
      onListo(j);
      avisarPorMail(`🎡 fungirak.com · Premio de la ruleta: ${j.codigo}`, { Premio: PREMIO_TXT[j.premio].es, Codigo: j.codigo, Vence: j.vence, Email: email, Nombre: nombre || "-" }, email);
    } catch { setEstado("error"); }
  };
  const copiar = async () => { try { await navigator.clipboard.writeText(cupon.codigo); setCopiado(true); } catch {} };
  return (
    <Modal onClose={onClose} color="#f59e0b" eyebrow={es ? "La ruleta del micelio" : "The mycelium wheel"} titulo={cupon ? (es ? "¡Es tuyo! 🎉" : "It's yours! 🎉") : (es ? "¡Ganaste! 🎉" : "You won! 🎉")}
      bajada={PREMIO_TXT[premio][es ? "es" : "en"]}>
      {cupon ? (
        <div className="reclamo">
          <p>{premio === "sorteo" ? (es ? "Ya estás participando. Este es tu número de participación:" : "You're in. This is your entry number:") : (es ? "Este es tu código de descuento. Mencionalo cuando me pidas tu proyecto:" : "This is your discount code. Mention it when you ask me for your project:")}</p>
          <div className="cupon"><code>{cupon.codigo}</code><button className="btn small ghost" onClick={copiar}>{copiado ? (es ? "Copiado ✓" : "Copied ✓") : (es ? "Copiar" : "Copy")}</button></div>
          <small>{es ? `Válido hasta el ${cupon.vence}. Un premio por persona.` : `Valid until ${cupon.vence}. One prize per person.`}</small>
        </div>
      ) : (
        <form className="reclamo" onSubmit={enviar}>
          <p>{es ? "Dejame tu email para guardar el premio a tu nombre." : "Leave your email to save the prize under your name."}</p>
          <div className="campo"><label htmlFor="rl-mail">{es ? "Tu email" : "Your email"}</label><input id="rl-mail" type="email" inputMode="email" autoComplete="email" required maxLength={120} autoFocus value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="campo"><label htmlFor="rl-nom">{es ? "Tu nombre (opcional)" : "Your name (optional)"}</label><input id="rl-nom" autoComplete="given-name" maxLength={60} value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
          {estado && estado !== "enviando" && <p className="aviso-err">{ERR[estado] || (es ? "No se pudo guardar. Probá de nuevo." : "Couldn't save it. Try again.")}</p>}
          <div className="acciones"><button className="btn amber" disabled={estado === "enviando"}>{estado === "enviando" ? (es ? "Guardando…" : "Saving…") : (es ? "Guardar mi premio" : "Save my prize")}</button></div>
          <small className="aviso-nota">{es ? "Sólo lo uso para tu premio y el sorteo. Nada de spam." : "Only used for your prize and the giveaway. No spam."}</small>
        </form>
      )}
    </Modal>
  );
}

export function Ruleta() {
  const { lang } = useLang();
  const es = lang === "es";
  const [giro, setGiro] = useState(0); // grados acumulados
  const [estado, setEstado] = useState("listo"); // listo | girando | otro | nada | gano | ya | error
  const [premio, setPremio] = useState(null);
  const [token, setToken] = useState(null);
  const [modal, setModal] = useState(false);
  const [guardado, setGuardado] = useState(null);
  useEffect(() => {
    const g = leer("fgk-ruleta");
    if (!g || g.dia !== hoyAR()) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- estado del día guardado en el dispositivo */
    setGuardado(g);
    setEstado(g.cupon ? "gano" : g.premio === "otro" ? "listo" : "ya");
    if (g.cupon) setPremio(g.premio);
  }, []);
  // Al cargar, el servidor dice si ya giró hoy (desde esta conexión o este dispositivo)
  useEffect(() => {
    fetch(`/api/ruleta?dispositivo=${encodeURIComponent(dispositivo())}`).then((r) => r.json()).then((j) => {
      if (j.puede === false && !j.error) setEstado((e) => (e === "listo" ? "ya" : e));
    }).catch(() => {});
  }, []);
  const [no, setNo] = useState(0); // sacudón de "no" cuando no se puede girar
  // Giro de presentación al aparecer en pantalla: da unas vueltas, frena e invita ("¡Te toca a vos!")
  const [zona, zonaVista] = useVisto(0.45);
  const [intro, setIntro] = useState("espera"); // espera | girando | lista
  useEffect(() => {
    if (!zonaVista) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- arranca la animación al entrar en pantalla (una sola vez) */
    setIntro(quieto ? "lista" : "girando");
    if (quieto) return;
    const t = setTimeout(() => setIntro("lista"), 3000);
    return () => clearTimeout(t);
  }, [zonaVista]);
  const girar = async () => {
    if (estado === "girando") return;
    setEstado("girando");
    let j = {};
    try {
      const r = await fetch("/api/ruleta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accion: "girar", dispositivo: dispositivo() }) });
      j = await r.json().catch(() => ({}));
      if (j.error === "ya-giraste") { setEstado("ya"); setNo((x) => x + 1); guardar("fgk-ruleta", { dia: hoyAR(), premio: "nada" }); return; }
      if (!r.ok || !j.premio) { setEstado("error"); return; }
    } catch { setEstado("error"); return; }
    // Cae en un gajo con ese premio (si hay dos iguales, uno al azar)
    const idx = GAJOS.map((g, i) => (g === j.premio ? i : -1)).filter((i) => i >= 0);
    const k = idx[Math.floor(Math.random() * idx.length)];
    const destino = 360 - (k * 45 + 22.5) + (Math.random() * 24 - 12);
    setGiro((g) => g - (g % 360) + 360 * 6 + destino);
    setTimeout(() => {
      setPremio(j.premio);
      setToken(j.token);
      guardar("fgk-ruleta", { dia: hoyAR(), premio: j.premio });
      if (j.premio === "otro") setEstado("otro");
      else if (j.premio === "nada") setEstado("nada");
      else { setEstado("gano"); setModal(true); }
    }, 4300);
  };
  const msg = {
    listo: es ? "Un giro por día. Los premios son de verdad." : "One spin a day. The prizes are real.",
    girando: es ? "Girando…" : "Spinning…",
    invita: es ? "¡Te toca a vos! 🎡" : "Your turn! 🎡",
    otro: es ? "¡Otro giro! Dale de nuevo 🍀" : "Spin again! Go 🍀",
    nada: es ? "Esta vez no 😅 Volvé mañana." : "Not this time 😅 Come back tomorrow.",
    ya: es ? "Ya giraste hoy. ¡Volvé mañana!" : "You already spun today. Come back tomorrow!",
    error: es ? "La ruleta se está preparando. Probá en un rato." : "The wheel is warming up. Try again soon.",
    gano: es ? "¡Ganaste! Guardá tu premio." : "You won! Save your prize.",
  }[estado === "listo" && intro === "lista" ? "invita" : estado];
  const puede = estado === "listo" || estado === "otro";
  return (
    <section className="band" id="ruleta" aria-labelledby="rul-t">
      <div className="wrap ruleta">
        <div>
          <Cabeza id="rul-t" ojo={es ? "La ruleta del micelio" : "The mycelium wheel"}
            titulo={es ? <>Girá y ganá un <span className="grad-text">descuento</span>.</> : <>Spin and win a <span className="grad-text">discount</span>.</>}
            bajada={es ? "Hasta 20% off en tu sitio o app, o entrar al sorteo de un sitio web gratis. Un giro por día." : "Up to 20% off your website or app, or a spot in the free website giveaway. One spin a day."} />
          <ul className="rul-premios">
            {["d20", "d15", "d10", "sorteo", "otro"].map((p) => <li key={p} style={{ "--c": ETIQ[p].c }}><i />{ETIQ[p][lang]}</li>)}
          </ul>
        </div>
        <div className="rul-zona">
          <div ref={zona} className={`rul-rueda-wrap ${no ? "no" : ""}`} key={no} onClick={() => { if (estado === "ya") setNo((x) => x + 1); }}>
            <span className="rul-flecha" aria-hidden="true">▼</span>
            <div className={`rul-intro ${intro === "girando" ? "gira" : ""}`}>
            <svg className="rul-rueda" viewBox="-110 -110 220 220" style={{ transform: `rotate(${giro}deg)` }} role="img" aria-label={es ? "Ruleta" : "Wheel"}>
              {GAJOS.map((g, i) => {
                const a0 = (i * 45 - 90) * (Math.PI / 180), a1 = ((i + 1) * 45 - 90) * (Math.PI / 180);
                const am = (i * 45 + 22.5 - 90);
                return (
                  <g key={i}>
                    <path d={`M0 0 L${100 * Math.cos(a0)} ${100 * Math.sin(a0)} A100 100 0 0 1 ${100 * Math.cos(a1)} ${100 * Math.sin(a1)} Z`} fill={ETIQ[g].c} stroke="var(--surface)" strokeWidth="2" />
                    <text transform={`rotate(${am}) translate(60 0)`} textAnchor="middle" dominantBaseline="middle" className="rul-txt">{ETIQ[g][lang]}</text>
                  </g>
                );
              })}
              <circle r="18" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="2" />
              <text textAnchor="middle" dominantBaseline="central" fontSize="16">🍄</text>
            </svg>
            </div>
          </div>
          <p className={`rul-msg ${estado === "ya" || estado === "nada" ? "aviso" : ""} ${estado === "listo" && intro === "lista" ? "invita" : ""}`} aria-live="polite">{msg}</p>
          {estado === "gano" ? (
            <button className="btn amber" onClick={() => setModal(true)}>{guardado?.cupon || token === null ? (es ? "Ver mi premio" : "See my prize") : (es ? "Guardar mi premio" : "Save my prize")} 🎁</button>
          ) : (
            <button className="btn amber pulse" disabled={!puede} onClick={girar}>🎡 {estado === "otro" ? (es ? "Girar otra vez" : "Spin again") : (es ? "Girar la ruleta" : "Spin the wheel")}</button>
          )}
          <small className="rul-legal">{es ? "Descuentos válidos por 60 días para proyectos nuevos; no acumulables. Un premio por persona por mes." : "Discounts valid for 60 days on new projects; not combinable. One prize per person per month."}</small>
        </div>
      </div>
      {modal && premio && (guardado?.cupon ? (
        <Modal onClose={() => setModal(false)} color="#f59e0b" eyebrow={es ? "Tu premio" : "Your prize"} titulo={PREMIO_TXT[premio][lang]}>
          <div className="reclamo"><div className="cupon"><code>{guardado.cupon}</code></div><small>{es ? `Válido hasta el ${guardado.vence}.` : `Valid until ${guardado.vence}.`}</small></div>
        </Modal>
      ) : token ? (
        <Reclamo premio={premio} token={token} es={es} onClose={() => setModal(false)} onListo={(c) => { const g = { dia: hoyAR(), premio: c.premio, cupon: c.codigo, vence: c.vence }; guardar("fgk-ruleta", g); setGuardado(g); }} />
      ) : null)}
    </section>
  );
}

// ---------- 5. El estudio en números ----------
const NUMEROS = [
  { n: 8, mas: false, es: "productos en línea", en: "live products" },
  { n: 24, mas: false, es: "jurisdicciones del país listas en Team Joy", en: "Argentine jurisdictions ready in Team Joy" },
  { n: 260, mas: true, es: "ministerios que pueden sumarse a Team Joy hoy", en: "ministries that can join Team Joy today" },
  { n: 500, mas: true, es: "secretarías que pueden sumarse a Team Joy hoy", en: "departments that can join Team Joy today" },
  { n: 3400, mas: true, es: "instituciones educativas en Santa Fe Schools", en: "schools in Santa Fe Schools" },
  { n: 2300, mas: true, es: "destinos para viajar en MiTour", en: "destinations in MiTour" },
  { n: 400, mas: true, es: "bares, cafés y restós en Santa Fe Gourmet", en: "bars, cafés and restaurants in Santa Fe Gourmet" },
  { n: 140, mas: true, es: "guías de entrenamiento en Atlas Fit Pro", en: "training guides in Atlas Fit Pro" },
  { n: 188, mas: false, es: "países en el mapa de MiTour", en: "countries on MiTour's map" },
];
function Contador({ n, activo, lang }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!activo) return;
    const t0 = performance.now();
    let raf;
    const paso = (t) => { const k = Math.min(1, (t - t0) / 1400); setV(Math.round(n * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(paso); };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [activo, n]);
  return <>{v.toLocaleString(lang === "es" ? "es-AR" : "en-US")}</>;
}
export function EnNumeros() {
  const { lang } = useLang();
  const es = lang === "es";
  const [ref, visto] = useVisto(0.3);
  return (
    <section className="band" id="numeros" aria-labelledby="num-t">
      <div className="wrap">
        <Cabeza id="num-t" ojo={es ? "El estudio en números" : "The studio in numbers"}
          titulo={es ? <>Lo que hay <span className="grad-text">del otro lado</span>.</> : <>What&apos;s <span className="grad-text">behind it</span>.</>}
          bajada={es ? "Todo gratis, sin publicidad y hecho desde Santo Tomé." : "All free, ad-free and made in Santo Tomé."} />
        <div ref={ref} className="numeros">
          {NUMEROS.map((x, i) => (
            <div key={i} className="numero" style={{ "--i": i }}>
              <b className="grad-text">{x.mas && "+"}<Contador n={x.n} activo={visto} lang={lang} /></b>
              <span>{x[lang]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
