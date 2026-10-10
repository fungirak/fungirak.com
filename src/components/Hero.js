"use client";
import { useEffect, useRef, useState } from "react";
import { useLang, tx } from "@/lib/i18n";
import { LINKS, PERFIL, VIDEO } from "@/data/perfil";
import { proyecto } from "@/data/proyectos";
import { Linkedin, Github, Instagram, Youtube, Whatsapp, Mail } from "./Iconos";
import Escenario from "./Escenario";

// Video "No Limits" de fondo: primero la miniatura; el video (unos 6 MB) entra recién cuando la página terminó de cargar
// y el visitante interactúa, o a los 4 s de quieto. Con "ahorro de datos" activado queda la miniatura.
function VideoFondo() {
  const [on, setOn] = useState(false);
  const [cargar, setCargar] = useState(false);
  const marco = useRef(null);
  const revelar = useRef(null);
  useEffect(() => {
    let id;
    const eventos = ["pointerdown", "pointermove", "scroll", "keydown", "touchstart"];
    const arrancar = () => {
      clearTimeout(id);
      eventos.forEach((ev) => window.removeEventListener(ev, arrancar));
      setCargar(true);
    };
    const cargada = () => {
      id = setTimeout(arrancar, 4000);
      eventos.forEach((ev) => window.addEventListener(ev, arrancar, { once: true, passive: true }));
    };
    const ahorro = navigator.connection?.saveData;
    if (!ahorro) {
      if (document.readyState === "complete") cargada();
      else window.addEventListener("load", cargada, { once: true });
    }
    // YouTube avisa el estado del reproductor: 1 = reproduciendo. Si está en pausa o bloqueado, queda la imagen.
    const msg = (e) => {
      try {
        if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const estado = d?.info?.playerState;
        // Al arrancar, YouTube muestra sus controles un par de segundos: el video aparece recién después
        if (estado === 1) {
          clearTimeout(revelar.current);
          revelar.current = setTimeout(() => setOn(true), 2600);
        } else if (estado === 2 || estado === -1 || estado === 5 || estado === 3) {
          clearTimeout(revelar.current);
          if (estado !== 3) setOn(false);
        }
      } catch {}
    };
    window.addEventListener("message", msg);
    return () => {
      clearTimeout(id);
      window.removeEventListener("load", cargada);
      eventos.forEach((ev) => window.removeEventListener(ev, arrancar));
      clearTimeout(revelar.current);
      window.removeEventListener("message", msg);
    };
  }, []);
  const escuchar = () => {
    const w = marco.current?.contentWindow;
    if (!w) return;
    // Pide al reproductor que informe sus cambios de estado
    w.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*");
    w.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"], id: 1, channel: "widget" }), "*");
  };
  const src = `https://www.youtube-nocookie.com/embed/${VIDEO.id}?autoplay=1&mute=1&loop=1&playlist=${VIDEO.id}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&enablejsapi=1`;
  return (
    <div className="video-bg" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${VIDEO.id}/hqdefault.jpg)` }} aria-hidden="true">
      {cargar && <iframe ref={marco} src={src} title={VIDEO.titulo} allow="autoplay; encrypted-media" tabIndex={-1} className={on ? "on" : ""} onLoad={escuchar} />}
    </div>
  );
}

export function Socials() {
  return (
    <div className="socials">
      <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>
      <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github /></a>
      <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /></a>
      <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube /></a>
      <a href={`https://wa.me/${LINKS.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Whatsapp /></a>
      <a href={`mailto:${LINKS.email}`} aria-label="Email"><Mail /></a>
    </div>
  );
}

// Posición de cada ícono de la comunidad sobre el borde de la tarjeta (en %)
const BORDE = [[8, 0], [30, 0], [52, 0], [74, 0], [96, 0], [100, 22], [100, 48], [100, 74], [92, 100], [68, 100], [44, 100], [20, 100], [0, 86], [0, 60], [0, 34], [0, 10]];

export default function Hero({ abrir, sellos, onSound, visitante, marco = [] }) {
  const { lang, ui } = useLang();
  // Un proyecto distinto cada día (hora de Argentina); 3 y 8 son coprimos: pasan todos antes de repetir
  const [dia] = useState(() => Math.floor((Date.now() - 3 * 3600e3) / 864e5));
  const hoy = PERFIL.estudio[(dia * 3) % PERFIL.estudio.length];
  const est = proyecto(hoy.proyecto);
  return (
    <>
      <VideoFondo />
      <main className="hero" id="inicio">
        <aside className="perfil" aria-label={PERFIL.nombre}>
          {marco.length > 0 && (
            <div className="marco" aria-hidden="true">
              {marco.map((e, i) => (
                <span key={i} style={{ left: `${BORDE[i][0]}%`, top: `${BORDE[i][1]}%`, animationDelay: `${-i * 0.4}s` }}>{e}</span>
              ))}
            </div>
          )}
          <div className="perfil-top">
            <div className="avatar">
              <img src="/img/fotoPerfil-200.webp" alt={`Foto de ${PERFIL.nombre}`} width={92} height={92} />
              <img className="utn" src="/img/update/LogoUTN-68.png" alt="UTN" width={34} height={34} />
            </div>
            <div>
              <h1 className="display">
                {PERFIL.nombre}
                <span className="alias">@{PERFIL.alias}</span>
              </h1>
              <p className="rol">
                {tx(PERFIL.rol, lang).endsWith("Full Stack") ? (
                  <>
                    {tx(PERFIL.rol, lang).slice(0, -"Full Stack".length)}
                    <span className="nowrap">Full Stack</span>
                  </>
                ) : (
                  tx(PERFIL.rol, lang)
                )}
              </p>
            </div>
          </div>
          <p className="meta">
            {tx(PERFIL.subrol, lang)}
            <br />
            {tx(PERFIL.titulo, lang)}
            <br />📍 {PERFIL.ciudad}
          </p>

          <div className="perfil-stats">
            <div><b className="grad-text">{PERFIL.experiencia}</b><span>{lang === "es" ? "años de exp." : "years exp."}</span></div>
            <div><b className="grad-text">8</b><span>{lang === "es" ? "productos en línea" : "live products"}</span></div>
            <div><b className="grad-text">10</b><span>{lang === "es" ? "certificados" : "certificates"}</span></div>
          </div>

          <div className="perfil-actions">
            <button className="btn pulse" onClick={() => abrir("hablemos")}>{visitante?.nombre ? `${ui.nav.hablemos}, ${visitante.nombre}` : ui.nav.hablemos} 👋</button>
            <button className="btn amber" onClick={() => abrir("brief")}>🚀 {ui.nav.pedir}</button>
            <button className="btn ghost" onClick={() => abrir("saber")}>{ui.nav.saber}</button>
            <button className="btn violet" onClick={() => abrir("juego")} style={{ gridColumn: "1 / -1" }}>🎮 {lang === "es" ? "Jugar a La Espora" : "Play La Espora"}</button>
          </div>

          <Socials />

          <button className="estudio" onClick={() => abrir(`proyecto:${est.id}`)}>
            <span className="pill live">{ui.enVivo}</span>
            <span suppressHydrationWarning>
              <b>{ui.estudio}</b>
              {tx(hoy, lang)}
            </span>
          </button>

          <a className="video-credit" href={`https://www.youtube.com/watch?v=${VIDEO.id}`} target="_blank" rel="noopener noreferrer">
            🎬 {ui.video} &ldquo;No Limits&rdquo; ↗
          </a>
        </aside>

        <Escenario onOpen={(id) => abrir(`proyecto:${id}`)} sellos={sellos} onSound={onSound} />
      </main>
    </>
  );
}
