"use client";
import { useState } from "react";
import Modal from "../Modal";
import { useLang } from "@/lib/i18n";
import { LINKS } from "@/data/perfil";
import { Socials } from "../Hero";
import { Whatsapp, Mail } from "../Iconos";
import { useFiltro, AvisoFiltro, claseFiltro } from "../Filtro";
import { avisarPorMail } from "@/lib/avisoMail";

const INTERESES = [
  { id: "contratar", ico: "💼", es: ["Contratarte", "Tengo una propuesta laboral"], en: ["Hire you", "I have a job offer"] },
  { id: "proyecto", ico: "🚀", es: ["Pedirte un sitio o app", "Te cuento la idea paso a paso"], en: ["Request a site or app", "I'll walk you through the idea"] },
  { id: "llamada", ico: "📞", es: ["Llamarte", "Prefiero hablar en vivo"], en: ["Call you", "I'd rather talk live"] },
  { id: "colaborar", ico: "🤝", es: ["Colaborar", "Sumemos fuerzas en algo"], en: ["Collaborate", "Let's join forces"] },
  { id: "redes", ico: "📱", es: ["Ver tus redes", "Quiero seguirte"], en: ["See your socials", "I want to follow you"] },
  { id: "saludar", ico: "👋", es: ["Solo saludar", "Pasaba por acá"], en: ["Just say hi", "Was passing by"] },
];

export default function Hablemos({ onClose, visitante, setVisitante, previo, onConfetti, onBrief }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [paso, setPaso] = useState(previo?.interes === "redes" ? 3 : visitante?.nombre ? (previo?.interes ? 2 : 1) : 0);
  const [nombre, setNombre] = useState(visitante?.nombre || "");
  const [interes, setInteres] = useState(previo?.interes || null);
  const [canal, setCanal] = useState(null);
  const [form, setForm] = useState({ email: "", telefono: "", mensaje: previo?.mensaje || "", _hp: "" });
  const [estado, setEstado] = useState(null);
  const malas = useFiltro(nombre, form.mensaje);

  const it = INTERESES.find((x) => x.id === interes);
  const textoWa = () =>
    es
      ? `¡Hola Gabriel! Soy ${nombre}. Te escribo desde fungirak.com: ${it ? it.es[0].toLowerCase() : "quería saludarte"}.${form.mensaje ? `\n\n${form.mensaje}` : ""}`
      : `Hi Gabriel! I'm ${nombre}. Writing from fungirak.com: ${it ? it.en[0].toLowerCase() : "just saying hi"}.${form.mensaje ? `\n\n${form.mensaje}` : ""}`;

  const enviar = async (e) => {
    e.preventDefault();
    if (malas.length || estado === "enviando") return;
    setEstado("enviando");
    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, perfil: visitante?.perfil || "", interes, idioma: lang, ...form }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) {
        // Ya quedó guardado; ahora el aviso al mail de Gabriel
        avisarPorMail(
          `🍄 fungirak.com${j.id ? ` #${j.id}` : ""} · ${nombre}: ${it ? it.es[0] : "Nuevo mensaje"}`,
          { Nombre: nombre, Email: form.email || "-", Telefono: form.telefono || "-", Interes: it ? it.es[0] : "-", Canal: canal || "-", Mensaje: form.mensaje || "-", Perfil: visitante?.perfil || "-", Idioma: lang },
          form.email || undefined
        );
        setEstado("ok");
        setPaso(4);
        onConfetti?.();
      } else setEstado(["limite", "email", "lenguaje"].includes(j.error) ? j.error : "error");
    } catch {
      setEstado("error");
    }
  };

  const siguienteNombre = (e) => {
    e.preventDefault();
    if (!nombre.trim() || malas.length) return;
    setVisitante((v) => ({ ...(v || {}), nombre: nombre.trim().slice(0, 40) }));
    setPaso(1);
  };

  const elegirInteres = (id) => {
    if (id === "proyecto" && onBrief) return onBrief();
    setInteres(id);
    setPaso(id === "redes" ? 3 : 2);
    if (id === "llamada") setCanal("llamada");
  };

  const pasos = 4;
  return (
    <Modal onClose={onClose} color="#00c853" eyebrow={es ? "Hablemos" : "Let's talk"} titulo={paso === 0 ? (es ? "¿Con quién tengo el gusto?" : "Who do I have the pleasure of meeting?") : paso === 4 ? (es ? `¡Gracias, ${nombre}! 🎉` : `Thank you, ${nombre}! 🎉`) : es ? `¡Hola, ${nombre}!` : `Hi, ${nombre}!`} label={es ? "Hablemos" : "Let's talk"}>
      <div className="modal-body">
        <div className="wizard-steps" aria-hidden="true">
          {Array.from({ length: pasos }, (_, i) => <span key={i} className={i <= Math.min(paso, 3) ? "on" : ""} />)}
        </div>

        {paso === 0 && (
          <form onSubmit={siguienteNombre}>
            <div className="campo">
              <label htmlFor="h-nombre">{es ? "Tu nombre (o como te guste que te digan)" : "Your name (or what you like to be called)"}</label>
              <input id="h-nombre" className={`big-input ${claseFiltro(nombre) || ""}`} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={es ? "Ej: Ana" : "e.g. Ana"} autoFocus maxLength={40} autoComplete="given-name" />
            </div>
            <AvisoFiltro palabras={malas} />
            <button className="btn" disabled={!nombre.trim() || malas.length > 0}>{es ? "¡Un gusto! Seguimos →" : "Nice to meet you! Next →"}</button>
          </form>
        )}

        {paso === 1 && (
          <>
            <p style={{ marginTop: 0 }}>{es ? "¿Qué te trae por acá? Elegí lo que más se parezca:" : "What brings you here? Pick the closest one:"}</p>
            <div className="opciones">
              {INTERESES.map((x) => (
                <button key={x.id} className="opcion" aria-pressed={interes === x.id} onClick={() => elegirInteres(x.id)}>
                  <span className="ico">{x.ico}</span>
                  <b>{x[lang][0]}</b>
                  <small>{x[lang][1]}</small>
                </button>
              ))}
            </div>
          </>
        )}

        {paso === 2 && !canal && (
          <>
            <p style={{ marginTop: 0 }}>
              {it?.ico} <b>{it?.[lang][0]}</b>. {es ? "¡Buenísimo! ¿Por dónde preferís seguir?" : "Great! How would you like to continue?"}
            </p>
            <div className="opciones">
              <button className="opcion" onClick={() => setCanal("whatsapp")}><span className="ico" style={{ color: "#25d366" }}><Whatsapp width={28} height={28} /></span><b>WhatsApp</b><small>{es ? "Respuesta más rápida" : "Fastest reply"}</small></button>
              <button className="opcion" onClick={() => setCanal("email")}><span className="ico" style={{ color: "var(--c-blue)" }}><Mail width={28} height={28} /></span><b>Email</b><small>{es ? "Te respondo en el día" : "I reply the same day"}</small></button>
              <button className="opcion" onClick={() => setCanal("llamada")}><span className="ico">📞</span><b>{es ? "Que me llame" : "Call me back"}</b><small>{es ? "Dejame tu número" : "Leave your number"}</small></button>
            </div>
            <button className="btn ghost small" style={{ marginTop: 14 }} onClick={() => setPaso(1)}>← {es ? "Volver" : "Back"}</button>
          </>
        )}

        {paso === 2 && canal === "whatsapp" && (
          <>
            <div className="campo">
              <label htmlFor="h-wa">{es ? "Si querés, contame algo más (opcional)" : "Tell me a bit more if you like (optional)"}</label>
              <textarea id="h-wa" className={claseFiltro(form.mensaje)} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} maxLength={1000} />
            </div>
            <AvisoFiltro palabras={malas} />
            <div className="acciones">
              {malas.length ? (
                <button className="btn wa" disabled><Whatsapp width={16} height={16} /> {es ? "Abrir WhatsApp" : "Open WhatsApp"}</button>
              ) : (
                <a className="btn wa" href={`https://wa.me/${LINKS.whatsapp}?text=${encodeURIComponent(textoWa())}`} target="_blank" rel="noopener noreferrer" onClick={() => { setPaso(4); onConfetti?.(); }}>
                  <Whatsapp width={16} height={16} /> {es ? "Abrir WhatsApp" : "Open WhatsApp"}
                </a>
              )}
              <button className="btn ghost small" onClick={() => setCanal(null)}>← {es ? "Otro canal" : "Another channel"}</button>
            </div>
          </>
        )}

        {paso === 2 && (canal === "email" || canal === "llamada") && (
          <form onSubmit={enviar}>
            <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form._hp} onChange={(e) => setForm({ ...form, _hp: e.target.value })} />
            {canal === "email" ? (
              <div className="campo">
                <label htmlFor="h-email">{es ? "Tu email" : "Your email"}</label>
                <input id="h-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" maxLength={120} />
              </div>
            ) : (
              <div className="campo">
                <label htmlFor="h-tel">{es ? "Tu teléfono (con código de área)" : "Your phone (with country code)"}</label>
                <input id="h-tel" type="tel" required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} autoComplete="tel" maxLength={40} />
              </div>
            )}
            <div className="campo">
              <label htmlFor="h-msg">{canal === "llamada" ? (es ? "¿Sobre qué y en qué horario te queda mejor?" : "About what, and what time works best?") : es ? "Tu mensaje" : "Your message"}</label>
              <textarea id="h-msg" className={claseFiltro(form.mensaje)} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} maxLength={2000} required={canal === "email"} />
            </div>
            {estado === "error" && <p className="aviso err">{es ? "Uy, no se pudo enviar. Probá por WhatsApp o escribime a " : "Oops, it didn't go through. Try WhatsApp or write to "}{LINKS.email}</p>}
            {estado === "limite" && <p className="aviso err">{es ? "Ya me mandaste varios mensajes. ¡Te respondo pronto!" : "You've sent several messages already. I'll reply soon!"}</p>}
            <AvisoFiltro palabras={malas} />
            {estado === "lenguaje" && !malas.length && <p className="aviso err">{es ? "Revisá el mensaje: tiene lenguaje que no va en este espacio 🙏" : "Check your message: it has language that doesn't belong here 🙏"}</p>}
            {estado === "email" && <p className="aviso err">{es ? "Revisá el email, parece que tiene un error." : "Check your email, it looks wrong."}</p>}
            <div className="acciones">
              <button className="btn" disabled={estado === "enviando" || malas.length > 0}>{estado === "enviando" ? (es ? "Enviando…" : "Sending…") : es ? "Enviar 🚀" : "Send 🚀"}</button>
              <button type="button" className="btn ghost small" onClick={() => setCanal(null)}>← {es ? "Otro canal" : "Another channel"}</button>
            </div>
          </form>
        )}

        {paso === 3 && (
          <>
            <p style={{ marginTop: 0 }}>{es ? "¡Genial! Acá estoy en todas partes:" : "Great! Here's where you can find me:"}</p>
            <Socials />
            <ul className="lista-emoji" style={{ marginTop: 16 }}>
              <li><span>📸</span><span>Instagram <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer">@fungirak</a> · Team Joy <a href={LINKS.teamjoyInstagram} target="_blank" rel="noopener noreferrer">@teamjoy.app</a></span></li>
              <li><span>💼</span><span>LinkedIn <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">/in/gabriel-lazzarini</a></span></li>
              <li><span>🎬</span><span>YouTube <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer">@fungirak</a></span></li>
              <li><span>🐙</span><span>GitHub <a href={LINKS.github} target="_blank" rel="noopener noreferrer">/fungirak</a></span></li>
            </ul>
            <div className="acciones">
              <button className="btn" onClick={() => { setInteres("saludar"); setPaso(2); }}>{es ? "Y de paso, ¡saludarte! 👋" : "And also, say hi! 👋"}</button>
            </div>
          </>
        )}

        {paso === 4 && (
          <div className="resultado">
            <p style={{ marginTop: 0 }}>
              {canal === "whatsapp"
                ? es ? "Te abrí WhatsApp con el mensaje listo. ¡Nos hablamos ahí!" : "WhatsApp is open with your message ready. Talk to you there!"
                : es ? "Me llegó tu mensaje. Lo leo todos los días, así que te respondo muy pronto." : "Your message arrived. I read them every day, so I'll reply very soon."}
            </p>
            <p>{es ? "Mientras tanto, llevate esto:" : "Meanwhile, take this with you:"}</p>
            <div className="acciones">
              <a className="btn small" href="/api/vcard">📇 {es ? "Agendarme" : "Save my contact"}</a>
              <a className="btn small ghost" href="/cv" target="_blank" rel="noopener noreferrer">📄 {es ? "Mi CV" : "My CV"}</a>
              <button className="btn small ghost" onClick={onClose}>{es ? "Seguir explorando" : "Keep exploring"} 🍄</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
