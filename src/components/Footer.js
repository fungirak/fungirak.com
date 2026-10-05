"use client";
import { useLang } from "@/lib/i18n";
import { LINKS } from "@/data/perfil";
import Sello from "./Sello";
import { Socials } from "./Hero";

export default function Footer({ abrir, stats }) {
  const { lang, ui } = useLang();
  const es = lang === "es";
  const col = (titulo, items) => (
    <div>
      <h3>{titulo}</h3>
      <ul>
        {items.map(([label, id, href]) => (
          <li key={label}>{href ? <a href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a> : <button onClick={() => abrir(id)}>{label}</button>}</li>
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
        {col(es ? "Contacto" : "Contact", [
          [ui.nav.hablemos, "hablemos"],
          [`💚 ${ui.nav.ayudar}`, "donar"],
          ["WhatsApp", null, `https://wa.me/${LINKS.whatsapp}`],
          [ui.cv, null, "/cv"],
          [ui.agendar, null, "/api/vcard"],
          [es ? "Política de privacidad" : "Privacy policy", "privacidad"],
        ])}
      </div>

      <div className="wrap footer-bottom">
        <span className="copy">
          © {new Date().getFullYear()} 🍄 Gabriel Lazzarini · FUNGIRAK Studio<span className="sep-desk"> · </span>
          <span className="renglon-m">{es ? "Hecho en Argentina 💚" : "Made in Argentina 💚"}</span>
        </span>
        <span className="live-stats">
          <span className="pill live">{ui.enVivo}</span>
          <span className="pill">👀 {(stats?.visitas || 0).toLocaleString(lang)} {ui.visitas}</span>
          <span className="pill">🍄 {stats?.pasaportes || 0} <span className="solo-desk">{ui.pasaportes}</span><span className="solo-m">{es ? "pasaportes" : "passports"}</span></span>
          <span className="pill">💬 {stats?.mensajes || 0} <span className="solo-desk">{ui.mensajes}</span><span className="solo-m">{es ? "charlas" : "chats"}</span></span>
        </span>
      </div>
    </footer>
  );
}
