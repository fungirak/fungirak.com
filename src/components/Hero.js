"use client";
import { useEffect, useState } from "react";
import { useLang, tx } from "@/lib/i18n";
import { LINKS, PERFIL, VIDEO } from "@/data/perfil";
import { proyecto } from "@/data/proyectos";
import { Linkedin, Github, Instagram, Youtube, Whatsapp, Mail } from "./Iconos";
import Escenario from "./Escenario";

// Video "No Limits" de fondo: primero la miniatura, el video entra cuando la página ya cargó.
function VideoFondo() {
  const [on, setOn] = useState(false);
  const [cargar, setCargar] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setCargar(true), 900);
    return () => clearTimeout(id);
  }, []);
  const src = `https://www.youtube-nocookie.com/embed/${VIDEO.id}?autoplay=1&mute=1&loop=1&playlist=${VIDEO.id}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1`;
  return (
    <div className="video-bg" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${VIDEO.id}/hqdefault.jpg)` }} aria-hidden="true">
      {cargar && <iframe src={src} title={VIDEO.titulo} allow="autoplay; encrypted-media" tabIndex={-1} className={on ? "on" : ""} onLoad={() => setTimeout(() => setOn(true), 600)} />}
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
  const est = proyecto(PERFIL.estudio.proyecto);
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
              <img src="/img/fotoPerfil.jpg" alt={`Foto de ${PERFIL.nombre}`} width={92} height={92} />
              <img className="utn" src="/img/update/LogoUTN.png" alt="UTN" width={34} height={34} />
            </div>
            <div>
              <h1 className="display">
                {PERFIL.nombre}
                <span className="alias">@{PERFIL.alias}</span>
              </h1>
              <p className="rol">{tx(PERFIL.rol, lang)}</p>
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
            <span>
              <b>{ui.estudio}</b>
              {tx(PERFIL.estudio, lang)}
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
