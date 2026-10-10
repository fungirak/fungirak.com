"use client";
import { useState } from "react";
import Modal from "../Modal";
import { useLang } from "@/lib/i18n";
import { useFiltro, AvisoFiltro, claseFiltro } from "../Filtro";

// Bienvenida estilo linktree, dentro del sitio: primero qué busca, después el nombre (opcional),
// y cada opción lleva directo a lo suyo. Pensada para quien llega desde la bio de Instagram.
export const DESTINOS = [
  { id: "brief", perfil: "cliente", ico: "🚀", es: ["Quiero mi propia app o sitio", "Tengo una idea y quiero que la construyas"], en: ["I want my own app or website", "I have an idea and want you to build it"], destacado: true },
  { id: "proyectos", perfil: "curioso", ico: "🧪", es: ["Ver tus apps y proyectos", "Quiero probar lo que hiciste"], en: ["See your apps and projects", "I want to try what you've built"] },
  { id: "contratar", perfil: "empresa", ico: "💼", es: ["Quiero sumarte a mi equipo", "Vengo de una empresa: empleo o proyecto en equipo"], en: ["I want you on my team", "I'm from a company: a job or a team project"] },
  { id: "colega", perfil: "colega", ico: "💻", es: ["Soy colega", "Desarrollo, diseño o estudio"], en: ["I'm a colleague", "I code, design or study"] },
  { id: "redes", perfil: "curioso", ico: "📱", es: ["Tus redes", "Instagram, LinkedIn, YouTube…"], en: ["Your socials", "Instagram, LinkedIn, YouTube…"] },
  { id: "donar", perfil: "curioso", ico: "💚", es: ["Apoyar el Studio", "Ayudar a que todo siga gratis"], en: ["Support the studio", "Help keep everything free"] },
];

export default function Bienvenida({ onClose, setVisitante, onListo, desdeInstagram }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [destino, setDestino] = useState(null);
  const [nombre, setNombre] = useState("");
  const malas = useFiltro(nombre);

  const terminar = (d) => {
    setVisitante({ nombre: nombre.trim().slice(0, 40) || null, perfil: d.perfil, busca: d.id, origen: desdeInstagram ? "instagram" : null });
    onListo?.(d.id);
  };

  return (
    <Modal onClose={() => { setVisitante((v) => ({ ...(v || {}), salteado: true })); onClose(); }} color="#00c853" head={false} label={es ? "Bienvenida" : "Welcome"}>
      <div className="modal-body" style={{ paddingTop: 30 }}>
        <div style={{ textAlign: "center" }}>
          <img src="/img/fotoPerfil.jpg" alt="" width={78} height={78} style={{ width: 78, height: 78, borderRadius: 26, objectFit: "cover", objectPosition: "50% 30%", margin: "0 auto", boxShadow: "0 0 0 3px var(--c-green), var(--shadow)" }} />
          <span className="bienvenida-ico" aria-hidden="true" style={{ fontSize: "2rem", marginTop: 6 }}>👋</span>
        </div>

        {!destino ? (
          <>
            <h2 className="display" style={{ textAlign: "center", fontSize: "clamp(1.4rem,4vw,2rem)", margin: "6px 0 4px" }}>
              {desdeInstagram ? (es ? "¡Hola! Llegaste desde Instagram 📸" : "Hi! You came from Instagram 📸") : es ? "¡Hola! Soy Gabriel" : "Hi! I'm Gabriel"}
            </h2>
            <p style={{ textAlign: "center", marginTop: 0 }}>
              {es ? "¿Qué te trae por acá?" : "What brings you here?"} <span className="renglon-m">{es ? "Tocá una opción y te llevo directo." : "Tap one and I'll take you straight there."}</span>
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {DESTINOS.map((d, i) => (
                <button
                  key={d.id}
                  className="tier"
                  style={{ animation: `rise .45s ${i * 0.05}s both`, ...(d.destacado ? { borderColor: "var(--c-green)", background: "color-mix(in srgb, var(--c-green) 12%, var(--surface-2))" } : {}) }}
                  onClick={() => setDestino(d)}
                >
                  <span className="ico">{d.ico}</span>
                  <span>
                    <b>{d[lang][0]}</b>
                    <span>{d[lang][1]}</span>
                  </span>
                  <span style={{ marginLeft: "auto", color: "var(--text-3)" }}>→</span>
                </button>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: "0.78rem", marginTop: 14, color: "var(--text-3)" }}>
              {es ? "o cerrá esta ventana y explorá libremente 🍄" : "or close this window and explore freely 🍄"}
            </p>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (!malas.length) terminar(destino); }} style={{ textAlign: "center" }}>
            <h2 className="display" style={{ fontSize: "clamp(1.4rem,4vw,2rem)", margin: "6px 0 4px" }}>
              {es ? "¿Con quién tengo el gusto?" : "Who do I have the pleasure of meeting?"}
            </h2>
            <p style={{ marginTop: 0 }}>{destino.ico} {destino[lang][0]}. {es ? "Contame tu nombre así te trato como corresponde." : "Tell me your name so I can greet you properly."}</p>
            <div className="campo">
              <label htmlFor="b-nombre" className="sr-only">{es ? "Tu nombre" : "Your name"}</label>
              <input id="b-nombre" className={`big-input ${claseFiltro(nombre) || ""}`} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={es ? "Tu nombre" : "Your name"} autoFocus maxLength={40} autoComplete="given-name" />
            </div>
            <AvisoFiltro palabras={malas} />
            <div className="acciones" style={{ justifyContent: "center" }}>
              <button className="btn" disabled={malas.length > 0}>{nombre.trim() ? (es ? `¡Un gusto, ${nombre.trim()}! →` : `Nice to meet you, ${nombre.trim()}! →`) : es ? "Seguir sin decirlo →" : "Continue anonymously →"}</button>
              <button type="button" className="btn ghost small" onClick={() => setDestino(null)}>← {es ? "Volver" : "Back"}</button>
            </div>
            <p style={{ fontSize: "0.78rem", marginTop: 16, color: "var(--text-3)" }}>
              {es ? "🎁 Te regalo tu primer sello del Pasaporte FUNGIRAK. Juntalos todos explorando el sitio." : "🎁 Here's your first FUNGIRAK Passport stamp. Collect them all by exploring the site."}
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}
