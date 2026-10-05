"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { SELLOS, nivelDe } from "@/lib/pasaporte";
import { Sol, Luna, Nota, Menu, Cruz } from "./Iconos";

export default function Nav({ abrir, tema, setTema, sonido, setSonido, sellos, visitante }) {
  const { lang, setLang, ui } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const items = [
    { id: "saber", label: ui.nav.saber, ico: "🙋" },
    { id: "proyectos", label: ui.nav.proyectos, ico: "🧪" },
    { id: "filosofia", label: ui.nav.filosofia, ico: "🍄" },
    { id: "trayectoria", label: ui.nav.trayectoria, ico: "🧭" },
    { id: "comunidad", label: ui.nav.comunidad, ico: "🫶" },
    { id: "brief", label: ui.nav.pedir, ico: "🚀" },
  ];

  const ir = (id) => {
    setDrawer(false);
    if (id === "proyectos") document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (id === "donar" || id === "comunidad") document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    else abrir(id);
  };

  const pct = Math.round((sellos.length / SELLOS.length) * 100);
  const nivel = nivelDe(sellos.length);

  const herramientas = (
    <>
      <button className="icon-btn" onClick={() => { setDrawer(false); abrir("juego"); }} aria-label={ui.nav.jugar} title={ui.nav.jugar}>🎮</button>
      <button className="icon-btn hide-m hide-l" onClick={() => ir("donar")} aria-label={ui.nav.ayudar} title={ui.nav.ayudar}>💚</button>
      <button className="passport-meter" onClick={() => { setDrawer(false); abrir("pasaporte"); }} aria-label={`${ui.nav.pasaporte}: ${sellos.length}/${SELLOS.length}`}>
        <span className="ring" style={{ "--p": pct }}><span>{nivel.icono}</span></span>
        <span>{sellos.length}/{SELLOS.length}</span>
      </button>
      <button className="icon-btn hide-m" onClick={() => setLang(lang === "es" ? "en" : "es")} aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}>
        <b style={{ fontSize: "0.72rem" }}>{lang === "es" ? "EN" : "ES"}</b>
      </button>
      <button className="icon-btn hide-m" aria-pressed={sonido} onClick={() => setSonido(!sonido)} aria-label={sonido ? ui.sonido.on : ui.sonido.off} title={sonido ? ui.sonido.on : ui.sonido.off}>
        <Nota />
      </button>
      <button className="icon-btn hide-m" onClick={() => setTema(tema === "dark" ? "light" : "dark")} aria-label={tema === "dark" ? ui.tema.claro : ui.tema.oscuro}>
        {tema === "dark" ? <Sol /> : <Luna />}
      </button>
    </>
  );

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="fungirak.com">
          <img src="/img/funguito.svg" alt="" width={34} height={34} />
          <span>
            fungirak
            <small>{visitante?.nombre ? `${ui.hola}, ${visitante.nombre}!` : "Studio"}</small>
          </span>
        </button>

        <nav className="nav-links" aria-label="Principal">
          {items.map((i) => (
            <button key={i.id} onClick={() => ir(i.id)}>{i.label}</button>
          ))}
          <button className="cta" onClick={() => abrir("hablemos")}>{ui.nav.hablemos} 👋</button>
        </nav>

        <div className="nav-tools">
          {herramientas}
          <button className="icon-btn hamburger" onClick={() => setDrawer(true)} aria-label={ui.menu} aria-expanded={drawer}>
            <Menu />
          </button>
        </div>
      </header>

      {drawer && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label={ui.menu}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="brand">
              <img src="/img/funguito.svg" alt="" width={34} height={34} />
              <span>fungirak<small>{visitante?.nombre ? `${ui.hola}, ${visitante.nombre}!` : "Studio"}</small></span>
            </div>
            <button className="icon-btn" onClick={() => setDrawer(false)} aria-label={ui.cerrar} autoFocus>
              <Cruz />
            </button>
          </div>
          <nav aria-label="Principal">
            {items.map((i) => (
              <button key={i.id} onClick={() => ir(i.id)}>
                <span>{i.ico}</span> {i.label}
              </button>
            ))}
            <button onClick={() => ir("donar")}>
              <span>💚</span> {ui.nav.ayudar}
            </button>
            <button onClick={() => { setDrawer(false); abrir("hablemos"); }} style={{ background: "var(--c-green)", color: "#04140a", borderColor: "transparent" }}>
              <span>👋</span> {ui.nav.hablemos}
            </button>
          </nav>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="chip" onClick={() => setLang(lang === "es" ? "en" : "es")}>{lang === "es" ? "🌎 English" : "🧉 Español"}</button>
            <button className="chip" aria-pressed={sonido} onClick={() => setSonido(!sonido)}>🎹 {sonido ? ui.sonido.on : ui.sonido.off}</button>
            <button className="chip" onClick={() => setTema(tema === "dark" ? "light" : "dark")}>{tema === "dark" ? "☀️ " + ui.tema.claro : "🌙 " + ui.tema.oscuro}</button>
          </div>
        </div>
      )}
    </>
  );
}
