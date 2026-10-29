"use client";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { useLang, tx } from "@/lib/i18n";
import { proyecto, PROYECTOS_EN_LINEA } from "@/data/proyectos";
import { BITACORA } from "@/data/bitacora";
import { avisarPorMail } from "@/lib/avisoMail";
import { tocar } from "@/lib/sonido";

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
            <div className="calc-barra" role="meter" aria-label={es ? "Complejidad del proyecto" : "Project complexity"} aria-valuemin={0} aria-valuemax={20} aria-valuenow={pts}><i style={{ width: `${Math.min(100, (pts / 20) * 100)}%` }} /></div>
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
  // «AAAA-MM» muestra mes y año; «AAAA-MM-DD» (un lanzamiento por semana) suma el día.
  const fmt = (f) => f.length > 7
    ? new Date(`${f}T12:00:00`).toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "short", year: "numeric" })
    : new Date(`${f}-15T12:00:00`).toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { month: "short", year: "numeric" });
  useEffect(() => {
    const n = pista.current;
    if (!n) return;
    const upd = () => setBorde({ ini: n.scrollLeft < 4, fin: n.scrollLeft + n.clientWidth >= n.scrollWidth - 4 });
    upd();
    n.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => { n.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  }, []);
  // Alto de cada mitad: el de la carta más alta (nombres largos en el celular no se cortan)
  useEffect(() => {
    const n = pista.current;
    const linea = n?.querySelector(".bit-linea");
    if (!linea) return;
    const medir = () => {
      const alto = Math.max(190, ...[...linea.querySelectorAll(".bit-card")].map((c) => c.offsetHeight + 8));
      linea.style.setProperty("--fila", `${Math.ceil(alto)}px`);
    };
    medir();
    const ro = new ResizeObserver(medir);
    linea.querySelectorAll(".bit-card").forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [lang]);
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
// «La ruleta de los que vuelven»: el premio no es al azar, lo decide el servidor según cuántos días distintos volviste
// (/api/ruleta). La escalera se muestra acá mismo: día 1, día 2, día 3 y del cuarto en adelante.
const GAJOS = ["d10", "d15", "mes", "d20", "d10", "d15", "mes", "d20"];
const ESCALERA = [["d10", 1], ["d15", 2], ["mes", 3], ["d20", 4]];
const ETIQ = {
  d10: { es: "10% OFF", en: "10% OFF", c: "var(--c-green)" },
  d15: { es: "15% OFF", en: "15% OFF", c: "var(--c-blue)" },
  d20: { es: "20% OFF", en: "20% OFF", c: "var(--c-rose)" },
  sorteo: { es: "Sorteo sitio", en: "Giveaway", c: "var(--c-amber)" },
  mes: { es: "1 mes de plan", en: "1 month plan", c: "#c99a06" },
  otro: { es: "Otro giro", en: "Spin again", c: "var(--c-violet)" },
  nada: { es: "Esta vez no", en: "Not this time", c: "var(--c-navy)" },
};
const PREMIO_TXT = {
  d10: { es: "10% de descuento en tu proyecto", en: "10% off your project" },
  d15: { es: "15% de descuento en tu proyecto", en: "15% off your project" },
  d20: { es: "20% de descuento en tu proyecto", en: "20% off your project" },
  sorteo: { es: "Entrás al sorteo de un sitio web gratis", en: "You're in the free website giveaway" },
  mes: { es: "1 mes gratis del plan FUNGIRAK en todas las apps", en: "1 free month of the FUNGIRAK plan in every app" },
};
const CUENTA_PLAN = "https://cuenta.fungirak.com/?seccion=plan";
const leer = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
// Sonidos de la ruleta (Web Audio, sin archivos): ganar = arpegio alegre, otro giro = dos notas, nada = tono suave
const SONIDO = {
  gano: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => tocar(f, { dur: 0.7, vol: 0.13 }), i * 110)),
  otro: () => [587.33, 880].forEach((f, i) => setTimeout(() => tocar(f, { dur: 0.5, vol: 0.11 }), i * 140)),
  nada: () => tocar(196, { dur: 0.8, tipo: "sine", vol: 0.1 }),
};
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const fechaAR = (f) => (f ? f.split("-").reverse().join("/") : ""); // 2026-12-05 → 05/12/2026
const hoyAR = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
function dispositivo() {
  let d = leer("fgk-disp");
  if (!d) { d = (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`).replace(/[^\w-]/g, "").slice(0, 36); guardar("fgk-disp", d); }
  return d;
}

// Qué hacer con el premio (se muestra al ganar y al volver a ver el cupón)
function Instrucciones({ premio, es }) {
  if (premio === "mes") return (
    <ol className="reclamo-pasos">
      <li>{es ? "Copiá tu código (también te llega por email)." : "Copy your code (you'll also get it by email)."}</li>
      <li>{es ? <>Entrá a <a href={CUENTA_PLAN}>cuenta.fungirak.com</a> (si no tenés cuenta, crearla es gratis) y en <b>Tu plan</b> pegalo en <b>Tenés un código de regalo</b>.</> : <>Go to <a href={CUENTA_PLAN}>cuenta.fungirak.com</a> (signing up is free) and paste it in <b>Your plan</b> › gift code.</>}</li>
      <li>{es ? "Listo: 30 días del plan FUNGIRAK en todas las apps del Studio." : "Done: 30 days of the FUNGIRAK plan in every Studio app."}</li>
    </ol>
  );
  return premio === "sorteo" ? (
    <p>{es ? <>El sorteo ahora es un concurso de ideas: mandá tu idea en <a href="/sorteo">fungirak.com/sorteo</a> con este mismo email.</> : <>The giveaway is now an ideas contest: send your idea at <a href="/sorteo">fungirak.com/sorteo</a> with this same email.</>}</p>
  ) : (
    <ol className="reclamo-pasos">
      <li>{es ? "Copiá tu código (también te llega por email)." : "Copy your code (you'll also get it by email)."}</li>
      <li>{es ? <>Tocá <b>Usar mi descuento</b> y contame tu proyecto: el código ya va cargado.</> : <>Tap <b>Use my discount</b> and tell me about your project: the code is already included.</>}</li>
      <li>{es ? "Cuando te pase el presupuesto, el descuento ya está aplicado." : "When I send you the quote, the discount is already applied."}</li>
    </ol>
  );
}

function Reclamo({ premio, token, onListo, onClose, onUsar, es }) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState(() => leer("fgk-visitante")?.nombre || "");
  const [estado, setEstado] = useState(null);
  const [cupon, setCupon] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const ERR = {
    email: es ? "Revisá el email." : "Check your email.",
    "email-usado": es ? "Ese email ya tiene un premio igual o mejor este mes." : "That email already has an equal or better prize this month.",
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
      const txt = PREMIO_TXT[j.premio].es;
      const hola = `¡Hola${nombre ? ` ${nombre}` : ""}!`;
      // Aviso a Gabriel + copia automática al visitante (respuesta automática de FormSubmit al campo "email")
      avisarPorMail(`🎡 fungirak.com · Premio de la ruleta: ${j.codigo}`, {
        Premio: txt, Codigo: j.codigo, Vence: fechaAR(j.vence), Nombre: nombre || "-", email,
        _autoresponse: j.premio === "mes"
          ? `${hola} Ganaste 1 mes gratis del plan FUNGIRAK en la ruleta de fungirak.com. Tu código: ${j.codigo} (válido hasta el ${fechaAR(j.vence)}). Para usarlo, entrá a cuenta.fungirak.com, andá a «Tu plan» y pegalo en «Tenés un código de regalo»: son 30 días del plan en todas las apps del Studio. — Gabriel · fungirak.com`
          : j.premio === "sorteo"
          ? `${hola} Ya estás participando del sorteo de un sitio web gratis de FUNGIRAK Studio. Tu número: ${j.codigo}. Cuando haga el sorteo te aviso a este email. — Gabriel · fungirak.com`
          : `${hola} Ganaste ${txt} en la ruleta de fungirak.com. Tu código: ${j.codigo} (válido hasta el ${fechaAR(j.vence)}). Para usarlo, entrá a fungirak.com, tocá "Pedime algo" y contame tu proyecto mencionando el código (si pedís desde el mismo dispositivo, ya va cargado). El descuento se aplica en tu presupuesto. — Gabriel · fungirak.com`,
      });
    } catch { setEstado("error"); }
  };
  const copiar = async () => { try { await navigator.clipboard.writeText(cupon.codigo); setCopiado(true); } catch {} };
  return (
    <Modal onClose={onClose} color="#f59e0b" eyebrow={es ? "La ruleta del micelio" : "The mycelium wheel"} titulo={cupon ? (es ? "¡Es tuyo! 🎉" : "It's yours! 🎉") : (es ? "¡Ganaste! 🎉" : "You won! 🎉")}
      bajada={PREMIO_TXT[premio][es ? "es" : "en"]}>
      <div className="modal-body">
        {cupon ? (
          <div className="reclamo">
            <div className="cupon"><code>{cupon.codigo}</code><button className="btn small ghost" onClick={copiar}>{copiado ? (es ? "Copiado ✓" : "Copied ✓") : (es ? "Copiar" : "Copy")}</button></div>
            <Instrucciones premio={cupon.premio} es={es} />
            {cupon.premio === "mes" ? <div className="acciones"><a className="btn amber" href={CUENTA_PLAN}>✦ {es ? "Canjear mi mes" : "Redeem my month"}</a></div>
              : cupon.premio !== "sorteo" && <div className="acciones"><button className="btn amber" onClick={() => onUsar(cupon.codigo)}>🎟️ {es ? "Usar mi descuento" : "Use my discount"}</button></div>}
            <small className="aviso-nota">{es ? `Te mandamos una copia a ${email}. Válido hasta el ${fechaAR(cupon.vence)}. Un premio por persona.` : `We sent a copy to ${email}. Valid until ${fechaAR(cupon.vence)}. One prize per person.`}</small>
          </div>
        ) : (
          <form className="reclamo" onSubmit={enviar}>
            <p>{es ? "Dejame tu email para guardar el premio a tu nombre. Te llega una copia con las instrucciones." : "Leave your email to save the prize under your name. You'll get a copy with instructions."}</p>
            <div className="campo"><label htmlFor="rl-mail">{es ? "Tu email" : "Your email"}</label><input id="rl-mail" type="email" inputMode="email" autoComplete="email" required maxLength={120} autoFocus value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="campo"><label htmlFor="rl-nom">{es ? "Tu nombre (opcional)" : "Your name (optional)"}</label><input id="rl-nom" autoComplete="given-name" maxLength={60} value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
            {estado && estado !== "enviando" && <p className="aviso-err">{ERR[estado] || (es ? "No se pudo guardar. Probá de nuevo." : "Couldn't save it. Try again.")}</p>}
            <div className="acciones"><button className="btn amber" disabled={estado === "enviando"}>{estado === "enviando" ? (es ? "Guardando…" : "Saving…") : (es ? "Guardar mi premio" : "Save my prize")}</button></div>
            <small className="aviso-nota">{es ? "Sólo lo uso para tu premio. Nada de spam." : "Only used for your prize. No spam."}</small>
          </form>
        )}
      </div>
    </Modal>
  );
}

// Las 12 ediciones del concurso como sellitos: punteados y vacíos hasta que hay ganadora; ahí se "estampan" con 🏆 y su código
function Sellos({ st, es }) {
  const ganado = Object.fromEntries((st.ganadores || []).map((g) => [g.fecha, g.codigo]));
  const corto = (f) => new Date(`${f}T12:00:00-03:00`).toLocaleDateString(es ? "es-AR" : "en-US", { month: "short", year: "2-digit" }).replace(".", "");
  return (
    <ol className="sellos" aria-label={es ? "Ediciones" : "Editions"}>
      {st.fechas.map((f, i) => {
        const g = ganado[f];
        const cls = g ? "hecho" : f === st.proximo ? "prox" : "";
        return (
          <li key={f} className={`sello ${cls}`} style={{ "--i": i }} title={g ? `${es ? "Ganó" : "Winner"} ${g}` : corto(f)}>
            <span className="sello-ico">{g ? "🏆" : f === st.proximo ? "💡" : i + 1}</span>
            <span className="sello-fecha">{corto(f)}</span>
            {g && <span className="sello-cod">{g.replace(/^(SORTEO|IDEA)-/, "")}</span>}
          </li>
        );
      })}
    </ol>
  );
}

// Próxima edición del concurso de ideas (datos públicos de /api/sorteo) con cuenta regresiva y link para mandar la idea
function ProximoConcurso({ es }) {
  const [st, setSt] = useState(null);
  useEffect(() => {
    fetch("/api/sorteo").then((r) => r.json()).then((j) => {
      if (j?.proximo) setSt({ ...j, dias: Math.max(0, Math.ceil((new Date(`${j.proximo}T12:00:00-03:00`) - Date.now()) / 864e5)) });
    }).catch(() => {});
  }, []);
  if (!st?.proximo) return null;
  const dias = st.dias;
  const fecha = new Date(`${st.proximo}T12:00:00-03:00`).toLocaleDateString(es ? "es-AR" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="rul-sorteo">
      <span className="rul-sorteo-ojo">💡 {es ? "Concurso de ideas: un sitio web gratis" : "Ideas contest: a free website"}</span>
      <b>{fecha}</b>
      <span>{dias === 0 ? (es ? "¡Cierra hoy!" : "Closes today!") : es ? `Faltan ${dias} días · ${st.ideas ? `${st.ideas} ${st.ideas === 1 ? "idea" : "ideas"}` : "¡Mandá la primera idea!"}` : `${dias} days to go · ${st.ideas ? `${st.ideas} ${st.ideas === 1 ? "idea" : "ideas"}` : "Send the first idea!"}`}</span>
      <small>{es ? "Cada dos meses gana la mejor idea (originalidad, utilidad, impacto y claridad). Gratis." : "Every two months the best idea wins (originality, usefulness, impact and clarity). Free."} <a href="/sorteo">{es ? "Mandá tu idea" : "Send your idea"}</a></small>
      <Sellos st={st} es={es} />
    </div>
  );
}

export function Ruleta({ abrir }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [giro, setGiro] = useState(0); // grados acumulados
  const [estado, setEstado] = useState("listo"); // listo | girando | otro | nada | gano | ya | error
  const [premio, setPremio] = useState(null);
  const [token, setToken] = useState(null);
  const [modal, setModal] = useState(false);
  const [guardado, setGuardado] = useState(null);
  const [hoy, setHoy] = useState(null); // { dia, premio }: qué le toca hoy a esta persona (lo dice el servidor)
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
    // El servidor manda: si dice que puede girar, se olvida lo anotado en el dispositivo (salvo un premio ganado)
    fetch(`/api/ruleta?dispositivo=${encodeURIComponent(dispositivo())}`).then((r) => r.json()).then((j) => {
      if (j.error) return;
      if (j.premio) setHoy({ dia: j.dia, premio: j.premio });
      if (j.puede === false) setEstado((e) => (e === "listo" ? "ya" : e));
      else if (!leer("fgk-ruleta")?.cupon) { try { localStorage.removeItem("fgk-ruleta"); } catch {} setGuardado(null); setEstado((e) => (e === "ya" || e === "nada" ? "listo" : e)); }
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
      if (j.premio === "otro") { setEstado("otro"); SONIDO.otro(); }
      else if (j.premio === "nada") { setEstado("nada"); SONIDO.nada(); }
      else { setEstado("gano"); SONIDO.gano(); setModal(true); }
    }, 4300);
  };
  const msg = {
    listo: hoy ? (es ? `Día ${hoy.dia}: hoy te toca ${ETIQ[hoy.premio].es}` : `Day ${hoy.dia}: today you get ${ETIQ[hoy.premio].en}`) : (es ? "Un giro por día." : "One spin a day."),
    girando: es ? "Girando…" : "Spinning…",
    invita: hoy ? (es ? `¡Día ${hoy.dia}! Hoy te toca ${ETIQ[hoy.premio].es} 🎡` : `Day ${hoy.dia}! Today you get ${ETIQ[hoy.premio].en} 🎡`) : (es ? "¡Te toca a vos! 🎡" : "Your turn! 🎡"),
    otro: es ? "¡Otro giro! Dale de nuevo 🍀" : "Spin again! Go 🍀",
    nada: es ? "Esta vez no 😅 Volvé mañana." : "Not this time 😅 Come back tomorrow.",
    ya: es ? "Ya giraste hoy. Volvé mañana: tu premio sube." : "You already spun today. Come back tomorrow: your prize goes up.",
    error: es ? "La ruleta se está preparando. Probá en un rato." : "The wheel is warming up. Try again soon.",
    gano: es ? "¡Ganaste! Guardá tu premio." : "You won! Save your prize.",
  }[estado === "listo" && intro === "lista" ? "invita" : estado];
  const puede = estado === "listo" || estado === "otro";
  return (
    <section className="band" id="ruleta" aria-labelledby="rul-t">
      <div className="wrap ruleta">
        <div>
          <Cabeza id="rul-t" ojo={es ? "La ruleta del micelio" : "The mycelium wheel"}
            titulo={es ? <>Volvé y <span className="grad-text">tu premio crece</span>.</> : <>Come back and <span className="grad-text">your prize grows</span>.</>}
            bajada={es ? "La ruleta de los que vuelven: no es suerte. Cada día distinto que girás, sube tu premio, y siempre ganás algo. Un giro por día." : "The comeback wheel: it's not luck. Every different day you spin, your prize goes up, and you always win something. One spin a day."} />
          <ul className="rul-premios">
            {ESCALERA.map(([p, d]) => <li key={p} style={{ "--c": ETIQ[p].c }}><i />{es ? `Día ${d}${d === 4 ? " en adelante" : ""}: ` : `Day ${d}${d === 4 ? "+" : ""}: `}{ETIQ[p][lang]}</li>)}
          </ul>
          <ProximoConcurso es={es} />
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
          <small className="rul-legal"><a href="/sorteo">{es ? "Bases y condiciones" : "Terms"}</a> · {es ? "No es al azar: el premio depende de cuántos días distintos volviste. Descuentos válidos por 60 días para proyectos nuevos, no acumulables. Un premio vigente por persona por mes (si subís de escalón, reemplaza al anterior)." : "Not random: the prize depends on how many different days you came back. Discounts valid for 60 days on new projects, not combinable. One active prize per person per month (moving up replaces the previous one)."}</small>
        </div>
      </div>
      {modal && premio && (guardado?.cupon ? (
        <Modal onClose={() => setModal(false)} color="#f59e0b" eyebrow={es ? "Tu premio" : "Your prize"} titulo={PREMIO_TXT[premio][lang]}>
          <div className="modal-body"><div className="reclamo">
            <div className="cupon"><code>{guardado.cupon}</code></div>
            <Instrucciones premio={premio} es={es} />
            {premio !== "sorteo" && <div className="acciones"><button className="btn amber" onClick={() => { setModal(false); abrir?.("brief", { brief: { cupon: guardado.cupon } }); }}>🎟️ {es ? "Usar mi descuento" : "Use my discount"}</button></div>}
            <small className="aviso-nota">{es ? `Válido hasta el ${fechaAR(guardado.vence)}.` : `Valid until ${fechaAR(guardado.vence)}.`}</small>
          </div></div>
        </Modal>
      ) : token ? (
        <Reclamo premio={premio} token={token} es={es} onClose={() => setModal(false)} onUsar={(c) => { setModal(false); abrir?.("brief", { brief: { cupon: c } }); }} onListo={(c) => { const g = { dia: hoyAR(), premio: c.premio, cupon: c.codigo, vence: c.vence }; guardar("fgk-ruleta", g); setGuardado(g); }} />
      ) : null)}
    </section>
  );
}

// ---------- 5. El estudio en números ----------
const NUMEROS = [
  { n: PROYECTOS_EN_LINEA, mas: false, es: "productos en línea", en: "live products" },
  { n: 24, mas: false, es: "jurisdicciones del país listas en Team Joy", en: "Argentine jurisdictions ready in Team Joy" },
  { n: 3400, mas: true, es: "instituciones educativas en Santa Fe Schools", en: "schools in Santa Fe Schools" },
  { n: 2300, mas: true, es: "lugares para pescar en el litoral, en la Escuela del Pescador", en: "fishing spots on the Litoral, in the Fishing School" },
  { n: 400, mas: true, es: "bares, cafés y restós en Santa Fe Gourmet", en: "bars, cafés and restaurants in Santa Fe Gourmet" },
  { n: 200, mas: false, es: "preguntas en La Gran Trivia", en: "questions in The Great Trivia" },
  { n: 85, mas: false, es: "preguntas de tu día en Hoy", en: "questions about your day in Hoy" },
  { n: 56, mas: false, es: "modelos de CV por puesto en CV", en: "résumé templates by job in CV" },
  { n: 260, mas: true, es: "ministerios que pueden sumarse a Team Joy hoy", en: "ministries that can join Team Joy today" },
  { n: 500, mas: true, es: "secretarías que pueden sumarse a Team Joy hoy", en: "departments that can join Team Joy today" },
  { n: 156, mas: false, es: "temas de ciberseguridad en Atalaya", en: "cybersecurity topics in Atalaya" },
  { n: 54, mas: false, es: "temas para escuchar en el homenaje a El Peyote Asesino", en: "songs to play on the El Peyote Asesino tribute" },
  { n: 140, mas: true, es: "guías de entrenamiento en Atlas Fit Pro", en: "training guides in Atlas Fit Pro" },
  { n: 188, mas: false, es: "países en el mapa de MiTour", en: "countries on MiTour's map" },
  { n: 60, mas: false, es: "figuritas del litoral en el álbum de Figus", en: "Litoral stickers in the Figus album" },
  { n: 32, mas: false, es: "bancos con su tasa de plazo fijo del día en Rinde", en: "banks with today's term deposit rate in Rinde" },
  { n: 12, mas: false, es: "emergencias paso a paso en Primeros Auxilios", en: "step-by-step emergencies in First Aid" },
  { n: 8, mas: false, es: "especies en la Escuela de las Mascotas", en: "species in the Pet School" },
];
const NUMEROS_A_LA_VISTA = 8;
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
  const [todos, setTodos] = useState(false);
  return (
    <section className="band" id="numeros" aria-labelledby="num-t">
      <div className="wrap">
        <Cabeza id="num-t" ojo={es ? "El estudio en números" : "The studio in numbers"}
          titulo={es ? <>Lo que hay <span className="grad-text">del otro lado</span>.</> : <>What&apos;s <span className="grad-text">behind it</span>.</>}
          bajada={es ? "Todo gratis, sin publicidad y hecho desde Santo Tomé." : "All free, ad-free and made in Santo Tomé."} />
        <div ref={ref} className="numeros">
          {NUMEROS.slice(0, todos ? NUMEROS.length : NUMEROS_A_LA_VISTA).map((x, i) => (
            <div key={i} className="numero" style={{ "--i": i }}>
              <b className="grad-text">{x.mas && "+"}<Contador n={x.n} activo={visto} lang={lang} /></b>
              <span>{x[lang]}</span>
            </div>
          ))}
        </div>
        {NUMEROS.length > NUMEROS_A_LA_VISTA && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <button className="chip" aria-expanded={todos} onClick={() => setTodos(!todos)}>{todos ? (es ? "Ver menos" : "Show less") : (es ? `Ver ${NUMEROS.length - NUMEROS_A_LA_VISTA} números más` : `Show ${NUMEROS.length - NUMEROS_A_LA_VISTA} more`)}</button>
          </div>
        )}
      </div>
    </section>
  );
}
