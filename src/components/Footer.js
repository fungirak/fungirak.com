"use client";
import { useLang, tx } from "@/lib/i18n";
import { LINKS } from "@/data/perfil";
import { PROYECTOS, ORDEN_FILAS } from "@/data/proyectos";
import { useState } from "react";
import Sello from "./Sello";
import Modal from "./Modal";
import { Socials } from "./Hero";

// la columna de proyectos se separa en Apps, Juegos y Sitios (como la franja de los sitios)
// las mismas categorías que las filas de cards de la portada (5 Juegos, 6 Sitios): un producto, una sola categoría (AUTO-007)
const JUEGOS = ORDEN_FILAS[4];
const SITIOS = ORDEN_FILAS[5];

// En las columnas de proyectos, al pasar el mouse (o con el teclado) aparece una tarjetita con el ícono, qué es y la firma del estudio.
function AppTip({ p, label, href, lang, es }) {
  const id = `tip-${p.id}`;
  return (
    <span className="ft-app">
      <a href={href} target="_blank" rel="noopener noreferrer" aria-describedby={id}>{label} ↗</a>
      <span className="ft-tip" role="tooltip" id={id}>
        {p.logo ? <img src={p.logo} alt="" width="44" height="44" loading="lazy" /> : <span className="ft-tip-ini" style={{ background: p.color }} aria-hidden="true">{label.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>}
        <span>
          <b>{label}</b>
          {p.tagline && <span className="ft-tip-que">{tx(p.tagline, lang)}</span>}
          <small>{es ? "Un producto de " : "A product by "}<span className="grad-text">FUNGIRAK Studio</span></small>
        </span>
      </span>
    </span>
  );
}

// En el pie, cada categoría muestra las primeras 5; el resto se ve en un modal con la lista completa por categoría (como el menú de
// categorías de una tienda), en vez de una columna larguísima.
const VISIBLES = 5;
// Los que van primero en cada categoría del pie (los demás siguen en su orden de siempre).
const PRIMERO = [
  ["teamjoy", "dertin", "atlas", "asador", "musgui"],
  ["cronicas"],
  ["turnapos", "pulso", "rio", "schools", "gourmet"],
];
const primero = (lista, ids) => [...ids.map((id) => lista.find((p) => p.id === id)).filter(Boolean), ...lista.filter((p) => !ids.includes(p.id))];

export default function Footer({ abrir, stats }) {
  const { lang, ui } = useLang();
  const es = lang === "es";
  const [todo, setTodo] = useState(false);
  const CATS = [
    ["Apps", (p) => !JUEGOS.includes(p.id) && !SITIOS.includes(p.id)],
    [es ? "Juegos" : "Games", (p) => JUEGOS.includes(p.id)],
    [es ? "Sitios" : "Sites", (p) => SITIOS.includes(p.id)],
  ].map(([titulo, f], k) => [titulo, primero(PROYECTOS.filter((p) => p.url && f(p)), PRIMERO[k])]);
  const total = CATS.reduce((n, [, l]) => n + l.length, 0);
  const col = (titulo, items) => (
    <div>
      <h3>{titulo}</h3>
      <ul>
        {items.map(([label, id, href, proyecto]) => (
          <li key={label}>{proyecto ? <AppTip p={proyecto} label={label} href={href} lang={lang} es={es} /> : href ? <a href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a> : <button onClick={() => (id === "cookies" ? window.fkCookies?.abrir() : abrir(id))}>{label}</button>}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <div className="seal-wrap">
            <Sello size={120} />
            <div style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.7 }}>
              <div className="display" style={{ fontSize: "1rem", color: "var(--text)" }}>FUNGIRAK Studio</div>
              <div>{es ? "Productos digitales con alma, desde Santa Fe para el mundo." : "Digital products with soul, from Santa Fe to the world."}</div>
              <a href={`mailto:${LINKS.email}`} style={{ color: "var(--accent)" }}>{LINKS.email}</a>
            </div>
          </div>
          <div style={{ marginTop: 16 }}><Socials /></div>
        </div>
        {col(es ? "Explorar" : "Explore", [
          [ui.nav.saber, "saber"],
          [ui.nav.filosofia, "filosofia"],
          [ui.nav.pedir, "brief"],
          [ui.nav.trayectoria, "trayectoria"],
          [es ? "Constelación de skills" : "Skills constellation", "skills"],
          [ui.quiz, "quiz"],
          [es ? "Plan FUNGIRAK (todas las apps)" : "FUNGIRAK plan (all apps)", null, "https://cuenta.fungirak.com/planes"],
        ])}
        {col(es ? "Mi recorrido" : "My path", [
          [es ? "Experiencia laboral" : "Work experience", "experiencia"],
          [es ? "Educación" : "Education", "educacion"],
          [es ? "Certificados" : "Certificates", "certificados"],
          [es ? "Reconocimientos" : "Awards", "reconocimientos"],
          [es ? "Idiomas e intereses" : "Languages & interests", "idiomas"],
        ])}
        {col(es ? "En vivo" : "Live", [
          ["YouTube", "youtube"],
          ["GitHub", "github"],
          ["Instagram", "instagram"],
          ["Team Joy", null, LINKS.teamjoyPerfil],
          [ui.nav.pasaporte, "pasaporte"],
          [`${ui.terminal} (Ctrl+K)`, "terminal"],
        ])}
        <div className="footer-cats">
          {CATS.map(([titulo, lista]) => (
            <div key={titulo}>
              {col(titulo, lista.slice(0, VISIBLES).map((p) => [tx(p.nombre, lang), null, p.url, p]))}
              {lista.length > VISIBLES && <button type="button" className="ft-vermas" onClick={() => setTodo(true)}>{es ? `Ver las ${lista.length}` : `See all ${lista.length}`} <span aria-hidden="true">→</span></button>}
            </div>
          ))}
        </div>
        {col(es ? "Contacto" : "Contact", [
          [ui.nav.hablemos, "hablemos"],
          [`💚 ${ui.nav.ayudar}`, "donar"],
          ["WhatsApp", null, `https://wa.me/${LINKS.whatsapp}`],
          [ui.cv, null, "/cv"],
          [ui.agendar, null, "/api/vcard"],
          ["Cookies", "cookies"],
          [es ? "Política de privacidad" : "Privacy policy", "privacidad"],
          [es ? "Términos y privacidad completos" : "Terms and full privacy policy", null, "https://cuenta.fungirak.com/legal/sitios"],
        ])}
      </div>

      <div className="wrap footer-bottom">
        <span className="copy">
          © {new Date().getFullYear()} 🍄 Gabriel Lazzarini · FUNGIRAK Studio<span className="sep-desk"> · </span>
          <span className="renglon-m">{es ? "Hecho en Argentina 💚" : "Made in Argentina 💚"}</span>
        </span>
        <span className="live-stats">
          <span className="pill live">{ui.enVivo}</span>
          <span className="pill">👀 {stats?.visitas ? stats.visitas.toLocaleString(lang) : "—"} {ui.visitas}</span>
          <span className="pill">🍄 {stats?.pasaportes || 0} <span className="solo-desk">{ui.pasaportes}</span><span className="solo-m">{es ? "pasaportes" : "passports"}</span></span>
          <span className="pill">💬 {stats?.mensajes || 0} <span className="solo-desk">{ui.mensajes}</span><span className="solo-m">{es ? "charlas" : "chats"}</span></span>
        </span>
      </div>
      {todo && (
        <Modal onClose={() => setTodo(false)} wide eyebrow="FUNGIRAK Studio" titulo={es ? `Todo el Studio · ${total}` : `The whole Studio · ${total}`} bajada={es ? "Apps, juegos y sitios, ordenados por categoría." : "Apps, games and sites, sorted by category."}>
          <div className="modal-body"><div className="ft-todo">
            {CATS.map(([titulo, lista]) => (
              <section key={titulo}>
                <h3>{titulo} <small>{lista.length}</small></h3>
                <ul>{lista.map((p) => <li key={p.id}><a href={p.url} target="_blank" rel="noopener noreferrer">{tx(p.nombre, lang)} <span aria-hidden="true">↗</span></a>{p.tagline && <small>{tx(p.tagline, lang)}</small>}</li>)}</ul>
              </section>
            ))}
          </div></div>
        </Modal>
      )}
    </footer>
  );
}
