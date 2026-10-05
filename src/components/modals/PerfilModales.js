"use client";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { useLang, tx } from "@/lib/i18n";
import { SOBRE_MI, EXPERIENCIA, EDUCACION, RECONOCIMIENTOS, IDIOMAS, INTERESES, LINKS, PERFIL } from "@/data/perfil";
import { Socials } from "../Hero";

// Contador que sube animado
function Num({ to, suf = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1100);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}{suf}</>;
}

export function SaberMas({ onClose, abrir, visitante }) {
  const { lang, ui } = useLang();
  const es = lang === "es";
  const perfil = visitante?.perfil;
  // Atajos según quién visita
  const atajos = {
    empresa: [["📄", ui.cv, () => window.open("/cv", "_blank")], ["🏛️", es ? "Experiencia" : "Experience", () => abrir("experiencia")], ["👋", ui.nav.hablemos, () => abrir("hablemos")]],
    colega: [["✨", es ? "Stack completo" : "Full stack", () => abrir("skills")], ["🐙", "GitHub", () => abrir("github")], ["⌨️", ui.terminal, () => abrir("terminal")]],
    curioso: [["🍄", ui.nav.filosofia, () => abrir("filosofia")], ["🛂", ui.nav.pasaporte, () => abrir("pasaporte")], ["🧪", ui.quiz, () => abrir("quiz")]],
  }[perfil] || [["🍄", ui.nav.filosofia, () => abrir("filosofia")], ["🧭", ui.nav.trayectoria, () => abrir("trayectoria")], ["👋", ui.nav.hablemos, () => abrir("hablemos")]];

  return (
    <Modal onClose={onClose} eyebrow={es ? "Saber más" : "About"} titulo={es ? <>Hola, soy <span className="grad-text">Gabriel</span></> : <>Hi, I&apos;m <span className="grad-text">Gabriel</span></>} label={ui.nav.saber} bajada={`${tx(PERFIL.rol, lang)} · ${PERFIL.edad} ${es ? "años" : "years old"} · ${PERFIL.ciudad}`}>
      <div className="modal-body">
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <img src="/img/fungi1.jpg" alt="" width={120} height={120} style={{ borderRadius: 24, objectFit: "cover", boxShadow: "var(--shadow)" }} />
          <div style={{ flex: 1, minWidth: 240 }}>
            {SOBRE_MI[lang].map((t, i) => <p key={i} style={{ marginTop: 0 }}>{t}</p>)}
          </div>
        </div>
        <div className="datos">
          <div className="dato"><b><Num to={4} suf="+" /></b><span>{es ? "años en el Estado" : "years in government"}</span></div>
          <div className="dato"><b><Num to={8} /></b><span>{es ? "productos en línea" : "live products"}</span></div>
          <div className="dato"><b><Num to={3} /></b><span>{es ? "ministerios" : "ministries"}</span></div>
          <div className="dato"><b><Num to={10} /></b><span>{es ? "certificados" : "certificates"}</span></div>
        </div>
        <h3>⚡ {es ? "Atajos para vos" : "Shortcuts for you"}</h3>
        <div className="opciones">
          {atajos.map(([i, t, fn]) => (
            <button key={t} className="opcion" onClick={fn}><span className="ico">{i}</span><b>{t}</b></button>
          ))}
        </div>
        <h3>🔗 {es ? "Encontrame en" : "Find me on"}</h3>
        <Socials />
      </div>
    </Modal>
  );
}

export function Experiencia({ onClose }) {
  const { lang } = useLang();
  const es = lang === "es";
  return (
    <Modal onClose={onClose} color="#3b82f6" eyebrow={es ? "Mi recorrido" : "My path"} titulo={es ? "Experiencia laboral" : "Work experience"} bajada={es ? "Del Estado provincial a mis propios productos." : "From provincial government to my own products."}>
      <div className="modal-body" style={{ display: "grid", gap: 16 }}>
        {EXPERIENCIA.map((x) => (
          <article key={tx(x.lugar, lang)} style={{ padding: 18, borderRadius: 20, background: "var(--surface-2)", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <img src={x.logo} alt="" width={54} height={54} style={{ borderRadius: 14, background: "#fff", objectFit: "contain", padding: 4 }} />
              <div>
                <b className="display" style={{ fontSize: "1.05rem" }}>{tx(x.rol, lang)}</b>
                <div style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>{tx(x.lugar, lang)}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>{tx(x.org, lang)} · <b style={{ color: "var(--accent)" }}>{tx(x.desde, lang)}</b></div>
              </div>
            </div>
            <ul className="lista-emoji" style={{ marginTop: 12 }}>
              {x.items.map((i) => <li key={i.es}><span>{i.icono}</span><span>{tx(i, lang)}</span></li>)}
            </ul>
          </article>
        ))}
      </div>
    </Modal>
  );
}

export function Educacion({ onClose }) {
  const { lang } = useLang();
  const es = lang === "es";
  return (
    <Modal onClose={onClose} color="#8b5cf6" eyebrow={es ? "Mi recorrido" : "My path"} titulo={es ? "Educación" : "Education"} bajada={es ? "Ingeniería, sistemas y un título que ya es oficial." : "Engineering, systems and an official degree."}>
      <div className="modal-body" style={{ display: "grid", gap: 12 }}>
        {EDUCACION.map((e, i) => (
          <article key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: 16, borderRadius: 20, background: i === 0 ? "color-mix(in srgb, var(--c-violet) 14%, var(--surface-2))" : "var(--surface-2)", border: "1px solid var(--line)", animation: `rise .5s ${i * 0.08}s both` }}>
            <img src={e.logo} alt="" width={56} height={56} style={{ borderRadius: 14, background: "#fff", objectFit: "contain", padding: 4 }} />
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)" }}>{e.inst} · {e.años}</div>
              <b className="display" style={{ fontSize: "1rem" }}>{tx(e.nombre, lang)}</b>
              {e.detalle && <div style={{ fontSize: "0.84rem", color: "var(--text-2)" }}>{tx(e.detalle, lang)}</div>}
              {e.estado && <div style={{ marginTop: 6 }}><span className="pill live">{tx(e.estado, lang)}</span></div>}
              {e.verificar && <a href={e.verificar} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem", color: "var(--accent)" }}>{es ? "Verificar en el registro de resoluciones de la UTN FRSF ↗" : "Verify in UTN FRSF's resolutions registry ↗"}</a>}
            </div>
          </article>
        ))}
      </div>
    </Modal>
  );
}

export function Reconocimientos({ onClose }) {
  const { lang } = useLang();
  const es = lang === "es";
  const r = RECONOCIMIENTOS[0];
  return (
    <Modal onClose={onClose} color="#f59e0b" eyebrow={es ? "Reconocimientos" : "Awards"} titulo={tx(r.nombre, lang)} bajada={tx(r.fecha, lang)}>
      <div className="modal-body" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "5rem", animation: "float 3s ease-in-out infinite" }}>🏅</div>
        <p className="cita" style={{ "--c": "#f59e0b", textAlign: "left" }}>{tx(r.texto, lang)}</p>
        <p>{tx(r.emisor, lang)}</p>
      </div>
    </Modal>
  );
}

export function Idiomas({ onClose }) {
  const { lang } = useLang();
  const es = lang === "es";
  return (
    <Modal onClose={onClose} color="#22b8cf" eyebrow={es ? "Perfil" : "Profile"} titulo={es ? "Idiomas e intereses" : "Languages & interests"}>
      <div className="modal-body">
        <h3 style={{ marginTop: 0 }}>🗣️ {es ? "Idiomas" : "Languages"}</h3>
        {IDIOMAS.map((i) => (
          <div key={i.valor} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>{tx(i.nombre, lang)}</span>
              <span style={{ color: "var(--text-3)" }}>{tx(i.nivel, lang)}</span>
            </div>
            <div className="barra" style={{ margin: "6px 0 0" }}><i style={{ width: `${i.valor}%` }} /></div>
          </div>
        ))}
        <h3>💚 {es ? "Lo que me mueve" : "What drives me"}</h3>
        <div className="opciones">
          {INTERESES.map((i, k) => (
            <div key={i.es} className="opcion" style={{ cursor: "default", animation: `rise .5s ${k * 0.06}s both` }}>
              <span className="ico">{i.icono}</span>
              <b>{tx(i, lang)}</b>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function Privacidad({ onClose }) {
  const { lang } = useLang();
  const es = lang === "es";
  return (
    <Modal onClose={onClose} eyebrow="fungirak.com" titulo={es ? "Política de privacidad" : "Privacy policy"} bajada={es ? "Corta, clara y sin letra chica." : "Short, clear and no fine print."}>
      <div className="modal-body">
        <ul className="lista-emoji">
          {(es
            ? [
                ["🍪", "Este sitio no usa cookies de publicidad ni de seguimiento."],
                ["📱", "Tu nombre, tu pasaporte de sellos y tus preferencias (tema, idioma, sonido) se guardan solo en tu dispositivo."],
                ["✉️", "Si me escribís desde «Hablemos», guardo tu nombre, tu contacto y tu mensaje solamente para responderte. No los comparto ni los vendo. El aviso me llega por email a través de FormSubmit."],
                ["📊", "Cuento visitas, aplausos y pasaportes completos de forma anónima. Nunca guardo tu IP: solo un código irreversible para evitar abusos."],
                ["📈", "Uso Vercel Web Analytics, que mide visitas sin cookies y sin identificarte."],
                ["🎬", "El video de fondo se carga desde YouTube en modo de privacidad mejorada."],
                ["🗑️", `Si querés que borre tus datos, escribime a ${LINKS.email}.`],
              ]
            : [
                ["🍪", "This site uses no advertising or tracking cookies."],
                ["📱", "Your name, stamp passport and preferences (theme, language, sound) are stored only on your device."],
                ["✉️", "If you write to me through «Let's talk», I keep your name, contact and message only to reply. I never share or sell them. The notice reaches me by email via FormSubmit."],
                ["📊", "Visits, applause and completed passports are counted anonymously. I never store your IP: only an irreversible code to prevent abuse."],
                ["📈", "I use Vercel Web Analytics, which measures visits without cookies and without identifying you."],
                ["🎬", "The background video loads from YouTube in privacy-enhanced mode."],
                ["🗑️", `If you want your data deleted, write to ${LINKS.email}.`],
              ]
          ).map(([i, t]) => <li key={t}><span>{i}</span><span>{t}</span></li>)}
        </ul>
        <p style={{ fontSize: "0.8rem", marginTop: 18 }}>© {new Date().getFullYear()} FUNGIRAK.COM · {es ? "Todos los derechos reservados." : "All rights reserved."}</p>
      </div>
    </Modal>
  );
}
