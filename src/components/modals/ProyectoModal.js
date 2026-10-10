"use client";
import { useState } from "react";
import Modal from "../Modal";
import { proyecto, INDUSTRIAS } from "@/data/proyectos";
import { LINKS } from "@/data/perfil";
import { useLang, tx } from "@/lib/i18n";
import { avisarPorMail } from "@/lib/avisoMail";
import { Casa, Llave, Persona, Flecha, Linkedin, Instagram } from "../Iconos";

function Aplauso({ id, valor, onAplauso }) {
  const { ui } = useLang();
  const [bursts, setBursts] = useState([]);
  const [dados, setDados] = useState(() => {
    try {
      return Number(sessionStorage.getItem(`fgk-aplauso-${id}`) || 0);
    } catch {
      return 0;
    }
  });
  const click = () => {
    if (dados >= 10) return;
    const n = dados + 1;
    setDados(n);
    try {
      sessionStorage.setItem(`fgk-aplauso-${id}`, String(n));
    } catch {}
    const k = Date.now();
    setBursts((b) => [...b, k]);
    setTimeout(() => setBursts((b) => b.filter((x) => x !== k)), 900);
    onAplauso(id);
  };
  return (
    <button className="btn ghost aplauso" onClick={click} aria-label={ui.aplaudir} title={dados >= 10 ? "¡Gracias! 💚" : undefined}>
      👏 {valor || 0} <span style={{ fontWeight: 600, textTransform: "none" }}>{ui.aplausos}</span>
      {bursts.map((k) => (
        <span key={k} className="burst">👏</span>
      ))}
    </button>
  );
}

function TeamJoy({ p, lang }) {
  const es = lang === "es";
  const items = es
    ? [
        ["✨", "Oficinas y comunidades", "Creá o unite a tu oficina."],
        ["💰", "Finanzas sociales", "Colectas y campañas de donación, integradas con Mercado Pago."],
        ["🤝", "Compras grupales", "Propuestas con votación y transferencia de pagos al instante."],
        ["🎉", "Eventos", "Almuerzos, after offices y eventos en un toque."],
        ["🗳️", "Interacción", "Encuestas, preguntas y sorteos."],
        ["🏅", "Gamificación", "Ganá coins e insignias, comprá y vendé stickers para tu perfil."],
        ["🔄", "Conexión diaria", "Rutinas (historias) y metas del día (estados)."],
      ]
    : [
        ["✨", "Offices & communities", "Create or join your office."],
        ["💰", "Social finance", "Fundraisers and donation campaigns, integrated with Mercado Pago."],
        ["🤝", "Group purchases", "Voted proposals and instant payment transfers."],
        ["🎉", "Events", "Lunches, after-offices and events in one tap."],
        ["🗳️", "Interaction", "Polls, questions and raffles."],
        ["🏅", "Gamification", "Earn coins and badges, buy and sell stickers for your profile."],
        ["🔄", "Daily connection", "Routines (stories) and goals of the day (statuses)."],
      ];
  return (
    <>
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <img src="/img/teamjoy-logo-sq.jpg" alt="Team Joy" width={110} height={110} style={{ flex: "none", objectFit: "cover", borderRadius: "50%", background: "#fff", boxShadow: "0 0 0 4px #00e676, 0 0 40px rgba(0,230,118,.45)" }} />
        <div style={{ flex: 1, minWidth: 220 }}>
          <p className="cita" style={{ "--c": "#00c853" }}>{es ? "La experiencia lúdica para la oficina." : "The playful experience for the office."}</p>
          <p style={{ margin: 0 }}>
            {es ? (
              <>🌈 <b>Team Joy</b> es la <b>primera red social para empleados públicos</b>, pensada para revitalizar la vida laboral y combatir el burnout en la Administración Pública de Santa Fe y en el sector privado.</>
            ) : (
              <>🌈 <b>Team Joy</b> is the <b>first social network for public employees</b>, designed to revitalize work life and fight burnout in Santa Fe&apos;s public administration and the private sector.</>
            )}
          </p>
        </div>
      </div>
      <div className="datos">
        <div className="dato"><b>🎯</b><span>{es ? "Misión: crear comunidad y transformar la rutina en una experiencia significativa." : "Mission: build community and turn routine into a meaningful experience."}</span></div>
        <div className="dato"><b>📈</b><span>{es ? "Impacto: mejor cultura organizacional, más conexión y equipos motivados." : "Impact: better organizational culture, more connection, motivated teams."}</span></div>
      </div>
      <h3>💡 {es ? "Características principales" : "Main features"}</h3>
      <ul className="lista-emoji">
        {items.map(([i, t, d]) => (
          <li key={t}><span>{i}</span><span><b>{t}:</b> {d}</span></li>
        ))}
      </ul>
      <h3>🔗 {es ? "Seguí a Team Joy" : "Follow Team Joy"}</h3>
      <div className="acciones" style={{ marginTop: 0 }}>
        <a className="btn small ghost" href={LINKS.teamjoyLinkedin} target="_blank" rel="noopener noreferrer"><Linkedin width={14} height={14} /> {es ? "Página" : "Page"}</a>
        <a className="btn small ghost" href={LINKS.teamjoyLinkedinPerfil} target="_blank" rel="noopener noreferrer"><Linkedin width={14} height={14} /> {es ? "Perfil" : "Profile"}</a>
        <a className="btn small ghost" href={LINKS.teamjoyInstagram} target="_blank" rel="noopener noreferrer"><Instagram width={14} height={14} /> @teamjoy.app</a>
        <a className="btn small ghost" href={LINKS.teamjoyPerfil} target="_blank" rel="noopener noreferrer">🍄 {es ? "Mi perfil en Team Joy" : "My Team Joy profile"}</a>
      </div>
    </>
  );
}

function Problematica({ p, lang }) {
  const es = lang === "es";
  return (
    <>
      <div className="roles-grandes" aria-hidden="true">
        <div><span><Casa width={30} height={30} style={{ color: "#4A90E2" }} /></span>{es ? "Propietario" : "Owner"}</div>
        <div><span><Llave width={28} height={28} style={{ color: "#F5C542" }} /></span>{es ? "Técnico" : "Technician"}</div>
        <div><span><Persona width={28} height={28} style={{ color: "#50C878" }} /></span>{es ? "Inquilino" : "Tenant"}</div>
      </div>
      {p.problema[lang].map((t, i) => (
        <p key={i} className={i === 0 ? "cita" : ""}>{t}</p>
      ))}
    </>
  );
}

// "Avisame cuando salga": deja el email ahí mismo (sin saltar a Hablemos) y le llega a Gabriel por FormSubmit.
const leerLS = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
function AvisoSalida({ p, es }) {
  const clave = `fgk-aviso-${p.id}`;
  const [abierto, setAbierto] = useState(false);
  const [estado, setEstado] = useState(() => (typeof window !== "undefined" && leerLS(clave) ? "ok" : "form"));
  const [nombre, setNombre] = useState(() => (typeof window !== "undefined" && leerLS("fgk-visitante")?.nombre) || "");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const titulo = tx(p.nombre, es ? "es" : "en");
  const enviar = async (e) => {
    e.preventDefault();
    if (hp || estado === "enviando") return;
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) return setEstado("email");
    setEstado("enviando");
    const ok = await avisarPorMail(`🔔 fungirak.com · Avisame cuando salga: ${titulo}`,
      { Proyecto: titulo, Email: email.trim(), Nombre: nombre.trim() || "-", Idioma: es ? "es" : "en" }, email.trim());
    if (ok) { try { localStorage.setItem(clave, JSON.stringify({ email: email.trim(), at: Date.now() })); } catch {} setEstado("ok"); }
    else setEstado("error");
  };
  if (estado === "ok") return <p className="aviso-ok">✅ {es ? `¡Listo! Te aviso apenas salga ${titulo}.` : `Done! I'll let you know as soon as ${titulo} is out.`}</p>;
  if (!abierto) return <button className="btn" onClick={() => setAbierto(true)}>🔔 {es ? "Avisame cuando salga" : "Let me know"}</button>;
  return (
    <form className="aviso-form" onSubmit={enviar}>
      <div className="campo">
        <label htmlFor={`av-mail-${p.id}`}>{es ? "Tu email" : "Your email"}</label>
        <input id={`av-mail-${p.id}`} type="email" inputMode="email" autoComplete="email" autoFocus required maxLength={120} placeholder={es ? "tu@email.com" : "you@email.com"} value={email} onChange={(e) => { setEmail(e.target.value); if (estado !== "form") setEstado("form"); }} />
      </div>
      <div className="campo">
        <label htmlFor={`av-nom-${p.id}`}>{es ? "Tu nombre (opcional)" : "Your name (optional)"}</label>
        <input id={`av-nom-${p.id}`} autoComplete="given-name" maxLength={40} value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} />
      {estado === "email" && <p className="aviso-err">{es ? "Revisá el email, parece que le falta algo." : "Check your email, something seems off."}</p>}
      {estado === "error" && <p className="aviso-err">{es ? "No se pudo enviar. Probá de nuevo en un ratito." : "It couldn't be sent. Please try again in a bit."}</p>}
      <div className="acciones">
        <button className="btn" disabled={estado === "enviando"}>{estado === "enviando" ? (es ? "Enviando…" : "Sending…") : `🔔 ${es ? "Avisame" : "Notify me"}`}</button>
        <button type="button" className="btn ghost" onClick={() => setAbierto(false)}>{es ? "Cancelar" : "Cancel"}</button>
      </div>
      <small className="aviso-nota">{es ? "Solo lo uso para avisarte de este lanzamiento. Nada de spam." : "I'll only use it to tell you about this release. No spam."}</small>
    </form>
  );
}

function Proximo({ p, lang }) {
  const es = lang === "es";
  const ep = p.tipo === "ep";
  return (
    <>
      <div className="proximo">
        {ep ? <div className="vinyl" style={{ "--c": p.color, width: 150, height: 150, animationPlayState: "running" }} /> : <div className="book" style={{ "--c": p.color, width: 110, height: 150, fontSize: "2rem" }}>{p.id === "libro-1" ? "I" : "II"}</div>}
        <div>
          <p className="cita" style={{ "--c": p.color }}>
            {ep
              ? es ? "Mi primer EP, con música propia. Muy pronto." : "My first EP, with my own music. Coming very soon."
              : es ? "Un libro mío está en camino. Muy pronto vas a poder leerlo." : "A book of mine is on its way. Very soon you'll be able to read it."}
          </p>
          {ep && (
            <div className="ondas" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ animationDelay: `${-i * 0.07}s`, height: `${30 + ((i * 37) % 70)}%` }} />)}
            </div>
          )}
          <p>{es ? "Si querés enterarte apenas salga, dejame tu contacto y te aviso personalmente." : "If you want to know the moment it's out, leave me your contact and I'll tell you myself."}</p>
          <AvisoSalida p={p} es={es} />
          {ep && <div className="acciones"><a className="btn ghost" href={LINKS.youtube} target="_blank" rel="noopener noreferrer">▶ YouTube @fungirak</a></div>}
        </div>
      </div>
    </>
  );
}

function Generico({ p, lang }) {
  const { ui } = useLang();
  return (
    <>
      {p.lema && <p className="cita" style={{ "--c": p.color }}>{tx(p.lema, lang)}</p>}
      <p>{tx(p.descripcion, lang)}</p>
      {p.datos && (
        <div className="datos">
          {p.datos.map((d) => (
            <div className="dato" key={d.n + d.es}><b>{d.n}</b><span>{tx(d, lang)}</span></div>
          ))}
        </div>
      )}
      {p.destacados && (
        <>
          <h3>✨ {ui.destacados}</h3>
          <ul className="lista-emoji">
            {p.destacados[lang].map((d) => <li key={d}><span>🍄</span><span>{d}</span></li>)}
          </ul>
        </>
      )}
    </>
  );
}

export default function ProyectoModal({ id, onClose, abrir, stats, onAplauso }) {
  const { lang, ui } = useLang();
  const p = proyecto(id);
  const [adulto, setAdulto] = useState(() => {
    try {
      return sessionStorage.getItem("fgk-18") === "1";
    } catch {
      return false;
    }
  });
  if (!p) return null;

  const industrias = INDUSTRIAS.filter((i) => p.industrias.includes(i.id));
  const eyebrow = industrias.map((i) => tx(i, lang)).join(" · ");

  if (p.adultos && !adulto)
    return (
      <Modal onClose={onClose} color={p.color} head={false} label={tx(p.nombre, lang)}>
        <div className="modal-body puerta">
          <div className="ico">🔞</div>
          <h2 className="display">{tx(p.nombre, lang)}</h2>
          <p>{ui.adultos}</p>
          <div className="acciones" style={{ justifyContent: "center" }}>
            <button className="btn" onClick={() => { try { sessionStorage.setItem("fgk-18", "1"); } catch {} setAdulto(true); }}>{ui.adultosSi}</button>
            <button className="btn ghost" onClick={onClose}>{ui.adultosNo}</button>
          </div>
        </div>
      </Modal>
    );

  let cuerpo;
  if (p.id === "teamjoy") cuerpo = <TeamJoy p={p} lang={lang} />;
  else if (p.id === "problematica") cuerpo = <Problematica p={p} lang={lang} />;
  else if (p.tipo) cuerpo = <Proximo p={p} lang={lang} />;
  else cuerpo = <Generico p={p} lang={lang} />;

  return (
    <Modal onClose={onClose} color={p.color} eyebrow={eyebrow} titulo={tx(p.nombre, lang)} bajada={tx(p.tagline, lang)}>
      <div className="modal-body">
        {(p.logo || p.url) && (
          <div className="cabeza-proyecto">
            {p.logo && <img src={p.logo} alt={`Logo de ${tx(p.nombre, lang)}`} width={64} height={64} className="logo-real" />}
            {p.url && (
              <a className="btn" href={p.url} target="_blank" rel="noopener noreferrer" style={{ "--b": p.color === "#E5E5E5" ? "#1f2937" : p.color, "--bd": "rgba(0,0,0,.35)", "--fg": "#fff" }}>
                {ui.verSitio} <Flecha width={14} height={14} />
              </a>
            )}
          </div>
        )}
        <div className="stack" style={{ marginBottom: 14 }}>
          {p.pills.map((x) => <span key={x} className={`pill${x === "+18" ? " adult" : ""}`}>{x}</span>)}
        </div>
        {cuerpo}
        {p.stack && (
          <>
            <h3>🛠️ {ui.stack}</h3>
            <div className="stack">{p.stack.map((s) => <span className="pill" key={s}>{s}</span>)}</div>
          </>
        )}
        <div className="acciones">
          <Aplauso id={p.id} valor={stats?.aplausos?.[p.id]} onAplauso={onAplauso} />
          {p.fila === 2 && <button className="btn ghost" onClick={() => abrir("quiz")}>🧪 {lang === "es" ? "¿Algo así para vos?" : "Something like this for you?"}</button>}
        </div>
      </div>
    </Modal>
  );
}
