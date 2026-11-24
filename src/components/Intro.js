"use client";
// La entrada a fungirak.com: «la tele que se prende». Pantalla apagada con la lucecita de standby → al tocarla (o sola, si el
// navegador deja sonar o pasan unos segundos) se enciende como un tubo viejo, una línea de escáner baja y va escribiendo lo que el
// navegador sabe del visitante (o de su cuenta FUNGIRAK, si entró), y el sitio aparece con un fundido.
// Todo se calcula en el aparato y se olvida: nada se guarda ni se manda (solo se cuenta la visita en este navegador).
// Una vez por sesión. Se puede saltear. Con «menos animaciones» es solo un fundido corto y sin sonido.
// Sonidos: generados con Web Audio (sin archivos). Los navegadores no dejan sonar nada hasta que la persona toca algo: por eso el
// primer toque es «prender la tele».
import { useEffect, useRef, useState } from "react";
import { useFk } from "@/lib/fk-cliente";
import { SELLOS, leerSellos } from "@/lib/pasaporte";

const CLAVE = "fgk-intro";
const MUTE = "fgk-intro-mudo";

// ── Lo que sabe el navegador ──
const PROVINCIAS_TZ = { Cordoba: "Córdoba", Salta: "Salta", Jujuy: "Jujuy", Tucuman: "Tucumán", Catamarca: "Catamarca", La_Rioja: "La Rioja", San_Juan: "San Juan", Mendoza: "Mendoza", San_Luis: "San Luis", Rio_Gallegos: "Santa Cruz", Ushuaia: "Tierra del Fuego" };
function lugar() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    // Argentina: «America/Argentina/Cordoba» y también los nombres viejos («America/Buenos_Aires», «America/Cordoba»…)
    const ar = tz.match(/^America\/(?:Argentina\/)?(Buenos_Aires|Cordoba|Salta|Jujuy|Tucuman|Catamarca|La_Rioja|San_Juan|Mendoza|San_Luis|Rio_Gallegos|Ushuaia|Rosario)$/);
    if (ar) { const p = PROVINCIAS_TZ[ar[1]]; return p ? `Argentina · ${p}` : "Argentina"; }
    const ciudad = tz.split("/").pop()?.replace(/_/g, " ");
    return ciudad ? `${ciudad} · bienvenido/a de lejos` : "";
  } catch { return ""; }
}
function aparato() {
  const ua = navigator.userAgent;
  const so = /iPhone|iPad/.test(ua) ? "iPhone" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "tu aparato";
  const nav = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "";
  const celu = matchMedia("(pointer: coarse)").matches && innerWidth < 820;
  return `${celu ? "📱" : "💻"} ${so}${nav ? ` · ${nav}` : ""} · ${innerWidth}×${innerHeight}`;
}
function saludo(h) { return h < 6 ? "Buenas noches, trasnochador/a" : h < 13 ? "Buen día" : h < 20 ? "Buenas tardes" : "Buenas noches"; }
function origen() {
  try {
    const r = document.referrer ? new URL(document.referrer).hostname : "";
    if (!r || r === location.hostname) return "Escribiste la dirección a mano";
    const n = /instagram/.test(r) ? "Instagram" : /google/.test(r) ? "Google" : /facebook|fb\./.test(r) ? "Facebook" : /whatsapp/.test(r) ? "WhatsApp" : /linkedin/.test(r) ? "LinkedIn" : /fungirak\.com$/.test(r) ? "otra app de FUNGIRAK" : r.replace(/^www\./, "");
    return `Llegaste desde ${n}`;
  } catch { return ""; }
}
const hace = (ms) => { const d = Math.round(ms / 86400000); return d <= 0 ? "hoy" : d === 1 ? "ayer" : `hace ${d} días`; };

// ── Sonido (Web Audio, sin archivos) ──
function crearAudio() {
  try { const C = window.AudioContext || window.webkitAudioContext; return C ? new C() : null; } catch { return null; }
}
function sonidos(ac) {
  const ahora = () => ac.currentTime;
  const tono = (f, t, dur, vol = 0.05, tipo = "square", f2) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
  };
  const ruido = (t, dur, vol = 0.06) => {
    const b = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(), g = ac.createGain(), fl = ac.createBiquadFilter();
    fl.type = "highpass"; fl.frequency.value = 900; s.buffer = b;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl).connect(g).connect(ac.destination); s.start(t);
  };
  return {
    encender() { const t = ahora(); tono(140, t, 0.06, 0.08, "square"); tono(7800, t + 0.04, 0.5, 0.012, "sine"); ruido(t + 0.08, 0.35, 0.05); },
    barrido(dur) { tono(90, ahora(), dur, 0.03, "sawtooth", 420); },
    bip(i) { tono([880, 988, 1175, 1319, 1480, 1760, 1976][i % 7], ahora(), 0.05, 0.025, "square"); },
    fax() { const t = ahora(); for (let i = 0; i < 6; i++) tono(1100 + (i % 2) * 900, t + i * 0.06, 0.06, 0.018, "square"); ruido(t + 0.36, 0.12, 0.02); },
    sello() { const t = ahora(); tono(110, t, 0.18, 0.12, "sine", 55); ruido(t, 0.08, 0.05); [523, 659, 784].forEach((f, i) => tono(f, t + 0.12 + i * 0.05, 0.5, 0.03, "triangle")); },
    acceso() { const t = ahora(); tono(1046, t, 0.08, 0.03); tono(1568, t + 0.11, 0.12, 0.03); },
  };
}

export default function Intro() {
  const [fase, setFase] = useState("inicio"); // inicio · apagada · encendiendo · escaneando · fin · fuera
  const [lineas, setLineas] = useState([]);
  const [final, setFinal] = useState(null);
  const [mudo, setMudo] = useState(false);
  const yo = useFk();
  const yoRef = useRef(yo); yoRef.current = yo;
  const ac = useRef(null), snd = useRef(null), corriendo = useRef(false);
  const estatica = useRef(null);
  const cerrado = useRef(false); // si se salteó, lo que seguía del escaneo no la vuelve a abrir

  // ¿Corresponde mostrarla? (una vez por sesión, solo en la portada, sin ?historia=)
  useEffect(() => {
    let ya = false;
    try { ya = sessionStorage.getItem(CLAVE) === "1" || new URLSearchParams(location.search).has("historia") || location.pathname !== "/"; } catch {}
    if (ya) { setFase("fuera"); return; } // eslint-disable-line react-hooks/set-state-in-effect -- se decide una vez, al entrar
    window.__fkIntroActiva = true;
    try { sessionStorage.setItem(CLAVE, "1"); } catch {}
    let m = false; try { m = localStorage.getItem(MUTE) === "1"; } catch {}
    setMudo(m);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { terminar(true); return; }
    // si el navegador ya deja sonar (visitante frecuente), arranca sola; si no, espera el toque o arranca muda a los 2,5 s
    const a = crearAudio(); ac.current = a;
    if (a && a.state === "running" && !m) { encender(); return; }
    setFase("apagada");
    const t = setTimeout(() => encender(), 4000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Estática de la tele sin señal (canvas chiquito, estirado)
  useEffect(() => {
    if (fase !== "encendiendo" && fase !== "escaneando") return;
    const c = estatica.current; if (!c) return;
    const x = c.getContext("2d"), img = x.createImageData(c.width, c.height); let id;
    const pinta = () => { const d = img.data; for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } x.putImageData(img, 0, 0); id = requestAnimationFrame(pinta); };
    pinta(); return () => cancelAnimationFrame(id);
  }, [fase]);

  function terminar(rapido) {
    if (cerrado.current) return; cerrado.current = true;
    setFase("fin");
    setTimeout(() => { setFase("fuera"); window.__fkIntroActiva = false; window.dispatchEvent(new Event("fk-intro-fin")); }, rapido ? 250 : 700);
  }

  async function encender() {
    if (corriendo.current) return; corriendo.current = true;
    let a = ac.current;
    if (!a) a = ac.current = crearAudio();
    // sin un toque, resume() nunca responde: se espera como mucho 200 ms y, si no se habilitó, la tele se prende muda
    try { if (a && a.state !== "running") await Promise.race([a.resume(), new Promise((r) => setTimeout(r, 200))]); } catch {}
    let m = false; try { m = localStorage.getItem(MUTE) === "1"; } catch {}
    snd.current = a && a.state === "running" && !m ? sonidos(a) : null;
    setFase("encendiendo"); snd.current?.encender();
    // espera la cuenta hasta 600 ms (si no llega, arranca como invitado)
    const t0 = Date.now(); while (yoRef.current === null && Date.now() - t0 < 600) await new Promise((r) => setTimeout(r, 50));
    await new Promise((r) => setTimeout(r, Math.max(0, 450 - (Date.now() - t0))));
    escanear(yoRef.current);
  }

  async function escanear(u) {
    const ahora = new Date(), h = ahora.getHours();
    const sellos = (() => { try { return leerSellos().length; } catch { return 0; } })();
    let visitas = 1, ultima = 0;
    try { const v = JSON.parse(localStorage.getItem("fgk-intro-visitas") || "{}"); visitas = (v.n || 0) + 1; ultima = v.t || 0; localStorage.setItem("fgk-intro-visitas", JSON.stringify({ n: visitas, t: Date.now() })); } catch {}
    const reloj = ahora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const oscuro = document.documentElement.dataset.theme === "dark";
    const logueado = !!u?.sesion;
    let L;
    if (logueado) {
      const nombre = (u.nombre || "").trim().split(" ")[0] || `@${u.usuario}`;
      const usadas = (u.apps || []).length;
      const ult = [...(u.apps || [])].sort((x, y) => String(y.uso || "").localeCompare(String(x.uso || "")))[0];
      const nombreUlt = ult && (u.catalogo || []).find((c) => c.id === ult.id)?.nombre;
      L = [
        `> ${reloj} · ${saludo(h)}`,
        `> IDENTIDAD: @${u.usuario}`,
        usadas ? `> Usás ${usadas} ${usadas === 1 ? "app" : "apps"} de FUNGIRAK${nombreUlt ? ` · la última: ${nombreUlt}` : ""}` : "> Todavía no abriste ninguna app con tu cuenta",
        `> Pasaporte: ${sellos} de ${SELLOS.length} sellos`,
        u.plan?.nombre ? `> Plan ${u.plan.nombre} ✦ activo` : `> ${aparato()}`,
        lugar() && `> 📍 ${lugar()}`,
      ].filter(Boolean);
      setFinal({ tipo: "yo", titulo: `Hola, ${nombre}.`, sub: "Identidad confirmada. Bienvenido/a de vuelta.", foto: u.foto, inicial: u.inicial || nombre[0] });
    } else {
      L = [
        `> ${reloj} · ${saludo(h)}`,
        lugar() && `> 📍 ${lugar()} (por tu reloj)`,
        `> ${aparato()}`,
        `> ${oscuro ? "🌙 Modo oscuro" : "☀️ Modo claro"} · idioma ${(navigator.language || "es").startsWith("es") ? "español" : navigator.language}`,
        origen() && `> ${origen()}`,
        visitas > 1 ? `> Visita n.º ${visitas} · la última fue ${hace(Date.now() - ultima)}${sellos ? ` · ${sellos} sellos` : ""}` : "> Primera visita registrada en este aparato",
      ].filter(Boolean);
      setFinal({ tipo: "invitado", titulo: "Sujeto no identificado.", sub: "Acceso de invitado concedido." });
    }
    if (cerrado.current) return;
    setFase("escaneando");
    const DUR = 3000, paso = DUR / (L.length + 1);
    snd.current?.barrido(DUR / 1000);
    for (let i = 0; i < L.length; i++) { await new Promise((r) => setTimeout(r, paso)); if (cerrado.current) return; setLineas((x) => [...x, L[i]]); snd.current?.bip(i); }
    if (logueado && u.foto) snd.current?.fax();
    await new Promise((r) => setTimeout(r, paso));
    setFase((f) => (f === "escaneando" ? "cierre" : f));
    if (logueado) { snd.current?.sello(); try { navigator.vibrate?.(30); } catch {} } else snd.current?.acceso();
    await new Promise((r) => setTimeout(r, 2200));
    terminar(false);
  }

  const alternarSonido = (e) => {
    e.stopPropagation();
    const n = !mudo; setMudo(n);
    try { localStorage.setItem(MUTE, n ? "1" : "0"); } catch {}
    snd.current = n || !ac.current ? null : sonidos(ac.current);
  };

  if (fase === "fuera") return null;
  return (
    <div className={`intro fase-${fase}`} role="presentation" onClick={() => (fase === "apagada" ? encender() : fase !== "inicio" && terminar(true))}>
      {/* si ya se vio en esta sesión, ni se pinta (sin parpadeo negro al recargar) */}
      <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("${CLAVE}")==="1"||location.pathname!=="/")document.documentElement.dataset.introVista="1"}catch(e){}` }} />
      <canvas ref={estatica} className="intro-estatica" width="160" height="90" aria-hidden="true" />
      <div className="intro-tubo" aria-hidden="true" />
      {fase === "apagada" && (
        <button type="button" className="intro-prender" onClick={(e) => { e.stopPropagation(); encender(); }}>
          <span className="intro-led" aria-hidden="true" />
          <b>Tocá para encender</b>
          <small>FUNGIRAK · canal 1</small>
        </button>
      )}
      {(fase === "escaneando" || fase === "cierre" || fase === "fin") && (
        <div className="intro-pantalla">
          <span className="intro-linea" aria-hidden="true" />
          <ul className="intro-datos" aria-live="polite">{lineas.map((l, i) => <li key={i}>{l}</li>)}</ul>
          {final && (fase === "cierre" || fase === "fin") && (
            <div className={`intro-final ${final.tipo}`}>
              {final.tipo === "yo" && (final.foto
                // eslint-disable-next-line @next/next/no-img-element -- foto de la cuenta FUNGIRAK
                ? <img className="intro-foto" src={final.foto} alt="" width="84" height="84" />
                : <span className="intro-foto intro-inicial">{final.inicial}</span>)}
              <b>{final.titulo}</b><small>{final.sub}</small>
              {final.tipo === "yo" && <span className="intro-sello" aria-hidden="true">FUNGIRAK<br />✓</span>}
            </div>
          )}
        </div>
      )}
      {fase !== "inicio" && fase !== "apagada" && <button type="button" className="intro-mudo" onClick={alternarSonido} aria-label={mudo ? "Activar sonido" : "Silenciar"}>{mudo ? "🔇" : "🔊"}</button>}
      {fase !== "inicio" && <span className="intro-saltear">Tocá para saltear</span>}
    </div>
  );
}
