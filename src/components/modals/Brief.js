"use client";
import { useEffect, useMemo, useState } from "react";
import Modal from "../Modal";
import { useLang } from "@/lib/i18n";
import { LINKS } from "@/data/perfil";
import { Whatsapp } from "../Iconos";
import { useFiltro, AvisoFiltro, claseFiltro } from "../Filtro";
import { avisarPorMail } from "@/lib/avisoMail";

// "Pedime algo": brief guiado con ingeniería de requerimientos, en pasos cortos y con pills.
const L = (es, en, ico) => ({ es, en, ico });

const OPC = {
  tipo: {
    web: L("Sitio web", "Website", "🌐"),
    tienda: L("Tienda online", "Online store", "🛍️"),
    app: L("App para el celu", "Phone app", "📱"),
    sistema: L("Sistema de gestión", "Management system", "🗂️"),
    plataforma: L("Plataforma o comunidad", "Platform or community", "🫂"),
    automatizacion: L("Automatización o bot", "Automation or bot", "🤖"),
    rediseno: L("Mejorar algo que ya tengo", "Improve something I have", "🛠️"),
    nose: L("Todavía no sé", "Not sure yet", "🤔"),
  },
  rubro: {
    publico: L("Sector público", "Public sector", "🏛️"),
    educacion: L("Educación", "Education", "🎓"),
    comercio: L("Comercio", "Retail", "🏪"),
    gastronomia: L("Gastronomía", "Food", "☕"),
    salud: L("Salud y bienestar", "Health", "💪"),
    turismo: L("Turismo", "Travel", "✈️"),
    inmobiliario: L("Inmobiliario", "Real estate", "🏠"),
    cultura: L("Música y cultura", "Music & culture", "🎸"),
    servicios: L("Servicios profesionales", "Professional services", "💼"),
    ong: L("ONG o comunidad", "NGO or community", "🤝"),
    otro: L("Otro", "Other", "✨"),
  },
  publico: {
    clientes: L("Mis clientes", "My customers", "🛒"),
    equipo: L("Mi equipo", "My team", "👥"),
    ciudadanos: L("Ciudadanos", "Citizens", "🏙️"),
    alumnos: L("Alumnos o familias", "Students or families", "🎒"),
    socios: L("Socios o miembros", "Members", "🎟️"),
    todos: L("Público en general", "General public", "🌎"),
  },
  objetivo: {
    vender: L("Vender más", "Sell more", "💸"),
    encontrar: L("Que me encuentren", "Be found", "🔎"),
    ordenar: L("Ordenar y ahorrar tiempo", "Organize & save time", "⏱️"),
    comunidad: L("Armar comunidad", "Build community", "🫶"),
    informar: L("Informar o enseñar", "Inform or teach", "📣"),
    medir: L("Medir y decidir con datos", "Measure with data", "📊"),
  },
  funciones: {
    login: L("Usuarios y login", "User accounts", "🔐"),
    pagos: L("Pagos online", "Online payments", "💳"),
    turnos: L("Turnos o reservas", "Bookings", "📅"),
    catalogo: L("Catálogo de productos", "Product catalog", "🗃️"),
    admin: L("Panel de administración", "Admin panel", "🧑‍💼"),
    mapa: L("Mapa", "Map", "🗺️"),
    whatsapp: L("WhatsApp o chat", "WhatsApp or chat", "💬"),
    notif: L("Notificaciones", "Notifications", "🔔"),
    idiomas: L("Varios idiomas", "Multiple languages", "🌍"),
    blog: L("Novedades o blog", "News or blog", "📰"),
    formularios: L("Formularios", "Forms", "📝"),
    reportes: L("Reportes y estadísticas", "Reports & stats", "📈"),
    gamificacion: L("Gamificación", "Gamification", "🏅"),
    ia: L("Inteligencia artificial", "AI features", "🧠"),
    integracion: L("Conectar con otro sistema", "Integrate another system", "🔌"),
    offline: L("Que funcione sin internet", "Works offline", "📴"),
  },
  hoy: {
    nada: L("Nada todavía", "Nothing yet", "🌱"),
    sitio: L("Un sitio o app vieja", "An old site or app", "🕸️"),
    planillas: L("Planillas o papel", "Spreadsheets or paper", "📄"),
    redes: L("Solo redes sociales", "Only social media", "📸"),
    sistema: L("Otro sistema", "Another system", "🖥️"),
  },
  contenido: {
    todo: L("Tengo todo listo", "Everything's ready", "✅"),
    algo: L("Tengo una parte", "I have some", "🧩"),
    nada: L("Necesito ayuda con eso", "I need help with it", "🙋"),
  },
  plataforma: {
    web: L("Web", "Web", "🌐"),
    app: L("App", "App", "📱"),
    ambas: L("Las dos", "Both", "🔀"),
    nose: L("Ayudame a elegir", "Help me choose", "🤷"),
  },
  urgencia: {
    ayer: L("Para ayer", "ASAP", "🔥"),
    mes: L("En un mes", "Within a month", "🗓️"),
    trimestre: L("En 1 a 3 meses", "In 1–3 months", "🌤️"),
    sinapuro: L("Sin apuro", "No rush", "🌿"),
  },
  presupuesto: {
    hablar: L("Prefiero hablarlo", "Rather discuss it", "💬"),
    chico: L("Acotado (empezar simple)", "Tight (start simple)", "🌱"),
    medio: L("Intermedio", "Medium", "🌳"),
    grande: L("Amplio (algo completo)", "Generous (full product)", "🚀"),
  },
  mantenimiento: {
    si: L("Sí, que lo mantengas", "Yes, maintain it", "🧰"),
    yo: L("Lo manejo yo", "I'll handle it", "🙌"),
    nose: L("No sé todavía", "Not sure", "🤔"),
  },
  canal: {
    whatsapp: L("WhatsApp", "WhatsApp", "💬"),
    email: L("Email", "Email", "✉️"),
    llamada: L("Llamada", "Call", "📞"),
  },
};

const VACIO = { tipo: "", rubro: "", publico: [], objetivo: [], problema: "", funciones: [], idea: "", referencias: "", hoy: "", contenido: "", plataforma: "", urgencia: "", fecha: "", presupuesto: "", mantenimiento: "", nombre: "", empresa: "", email: "", telefono: "", canal: "whatsapp", _hp: "" };
const KEY = "fgk-brief";

function Pills({ grupo, valor, onChange, multi, lang }) {
  return (
    <div className="stack" role="group">
      {Object.entries(OPC[grupo]).map(([id, o]) => {
        const on = multi ? valor.includes(id) : valor === id;
        return (
          <button
            type="button"
            key={id}
            className="chip"
            aria-pressed={on}
            onClick={() => onChange(multi ? (on ? valor.filter((x) => x !== id) : [...valor, id]) : on ? "" : id)}
          >
            {o.ico} {o[lang]}
          </button>
        );
      })}
    </div>
  );
}

export default function Brief({ onClose, visitante, setVisitante, previo, onConfetti }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [b, setB] = useState(() => {
    let guardado = {};
    try {
      guardado = JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {}
    return { ...VACIO, ...guardado, ...(previo?.brief || {}), nombre: guardado.nombre || visitante?.nombre || "" };
  });
  const [paso, setPaso] = useState(0);
  const [estado, setEstado] = useState(null);
  const [nro, setNro] = useState(null);
  const malas = useFiltro(b.problema, b.idea, b.referencias, b.nombre, b.empresa);

  useEffect(() => {
    try {
      const { _hp, ...resto } = b;
      localStorage.setItem(KEY, JSON.stringify(resto));
    } catch {}
  }, [b]);

  const set = (k) => (v) => setB((x) => ({ ...x, [k]: v }));
  const campo = (k) => ({ value: b[k], onChange: (e) => set(k)(e.target.value), className: claseFiltro(b[k]) });

  // Qué tan completo está el brief (gamificado)
  const completo = useMemo(() => {
    const checks = [b.tipo, b.rubro, b.publico.length, b.objetivo.length, b.problema.length > 20, b.funciones.length, b.idea.length > 20, b.hoy, b.contenido, b.plataforma, b.urgencia, b.presupuesto, b.mantenimiento, b.nombre, b.email || b.telefono];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [b]);
  const medalla = completo >= 90 ? "🏆" : completo >= 65 ? "🥇" : completo >= 35 ? "🥈" : "🥉";

  const PASOS = es ? ["Qué", "Para quién", "Cómo", "Contexto", "Tiempos", "Vos"] : ["What", "Who", "How", "Context", "Timing", "You"];
  const t = (grupo, id) => (id ? `${OPC[grupo][id].ico} ${OPC[grupo][id][lang]}` : "—");
  const tl = (grupo, ids) => (ids.length ? ids.map((id) => OPC[grupo][id][lang]).join(", ") : "—");

  const resumen = () =>
    [
      `${es ? "Tipo" : "Type"}: ${t("tipo", b.tipo)}`,
      `${es ? "Rubro" : "Field"}: ${t("rubro", b.rubro)}`,
      `${es ? "Público" : "Audience"}: ${tl("publico", b.publico)}`,
      `${es ? "Objetivos" : "Goals"}: ${tl("objetivo", b.objetivo)}`,
      `${es ? "Problema" : "Problem"}: ${b.problema || "—"}`,
      `${es ? "Funciones" : "Features"}: ${tl("funciones", b.funciones)}`,
      `${es ? "Idea" : "Idea"}: ${b.idea || "—"}`,
      `${es ? "Referencias" : "References"}: ${b.referencias || "—"}`,
      `${es ? "Hoy tiene" : "Has today"}: ${t("hoy", b.hoy)}`,
      `${es ? "Contenido" : "Content"}: ${t("contenido", b.contenido)}`,
      `${es ? "Plataforma" : "Platform"}: ${t("plataforma", b.plataforma)}`,
      `${es ? "Urgencia" : "Urgency"}: ${t("urgencia", b.urgencia)}${b.fecha ? ` · ${es ? "fecha clave" : "key date"} ${b.fecha}` : ""}`,
      `${es ? "Presupuesto" : "Budget"}: ${t("presupuesto", b.presupuesto)}`,
      `${es ? "Mantenimiento" : "Maintenance"}: ${t("mantenimiento", b.mantenimiento)}`,
    ].join("\n");

  const enviar = async () => {
    if (malas.length || estado === "enviando") return;
    if (!b.nombre.trim() || (!b.email.trim() && !b.telefono.trim())) {
      setEstado("faltan");
      return;
    }
    setEstado("enviando");
    setVisitante?.((v) => ({ ...(v || {}), nombre: b.nombre.trim().slice(0, 40) }));
    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: b.nombre,
          email: b.email,
          telefono: b.telefono,
          perfil: visitante?.perfil || "",
          interes: "proyecto",
          idioma: lang,
          mensaje: `${b.empresa ? `${es ? "Empresa" : "Company"}: ${b.empresa}\n` : ""}${es ? "Prefiere" : "Prefers"}: ${t("canal", b.canal)}\n${es ? "Brief completo al" : "Brief completeness"} ${completo}%\n\n${resumen()}`,
          brief: { ...b, _hp: undefined, completo },
          _hp: b._hp,
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) {
        avisarPorMail(
          `🚀 fungirak.com${j.id ? ` #${j.id}` : ""} · Pedido de proyecto de ${b.nombre}`,
          { Nombre: b.nombre, Empresa: b.empresa || "-", Email: b.email || "-", Telefono: b.telefono || "-", Prefiere: OPC.canal[b.canal]?.es || "-", Completo: `${completo}%`, Pedido: resumen() },
          b.email || undefined
        );
        setNro(j.id || null);
        setEstado("ok");
        setPaso(6);
        onConfetti?.();
        try {
          localStorage.removeItem(KEY);
        } catch {}
      } else setEstado(["email", "limite", "lenguaje"].includes(j.error) ? j.error : "error");
    } catch {
      setEstado("error");
    }
  };

  const textoWa = () => `${es ? "¡Hola Gabriel! Soy" : "Hi Gabriel! I'm"} ${b.nombre}${b.empresa ? ` (${b.empresa})` : ""}. ${es ? "Te mandé un pedido desde fungirak.com" : "I sent you a request from fungirak.com"}${nro ? ` (#${nro})` : ""}:\n\n${resumen()}`;

  return (
    <Modal onClose={onClose} wide color="#00c853" eyebrow={es ? "Pedime algo" : "Request a project"} titulo={paso === 6 ? (es ? `¡Recibido, ${b.nombre}! 🎉` : `Got it, ${b.nombre}! 🎉`) : es ? "Contame qué querés construir" : "Tell me what you want to build"} bajada={paso < 6 ? (es ? "Elegí con un toque; escribí solo si querés. Cuanto más detalle, más precisa mi propuesta." : "Tap to choose; type only if you want. More detail means a sharper proposal.") : undefined}>
      <div className="modal-body">
        {paso < 6 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, fontSize: "0.8rem", fontWeight: 700 }}>
              <span>{es ? "Paso" : "Step"} {paso + 1}/6 · {PASOS[paso]}</span>
              <span title={es ? "Qué tan completo está tu pedido" : "How complete your request is"}>{medalla} Brief {completo}%</span>
            </div>
            <div className="barra" style={{ margin: "8px 0 18px" }}><i style={{ width: `${completo}%` }} /></div>
          </>
        )}

        {paso === 0 && (
          <>
            <h3 style={{ marginTop: 0 }}>{es ? "¿Qué te imaginás?" : "What do you have in mind?"}</h3>
            <div className="opciones">
              {Object.entries(OPC.tipo).map(([id, o]) => (
                <button key={id} className="opcion" aria-pressed={b.tipo === id} onClick={() => { set("tipo")(id); setTimeout(() => setPaso(1), 180); }}>
                  <span className="ico">{o.ico}</span>
                  <b>{o[lang]}</b>
                </button>
              ))}
            </div>
          </>
        )}

        {paso === 1 && (
          <>
            <h3 style={{ marginTop: 0 }}>{es ? "¿De qué rubro?" : "Which field?"}</h3>
            <Pills grupo="rubro" valor={b.rubro} onChange={set("rubro")} lang={lang} />
            <h3>{es ? "¿Quién lo va a usar? (podés elegir varios)" : "Who will use it? (pick several)"}</h3>
            <Pills grupo="publico" valor={b.publico} onChange={set("publico")} multi lang={lang} />
            <h3>{es ? "¿Qué querés lograr?" : "What do you want to achieve?"}</h3>
            <Pills grupo="objetivo" valor={b.objetivo} onChange={set("objetivo")} multi lang={lang} />
            <div className="campo" style={{ marginTop: 16 }}>
              <label htmlFor="br-prob">{es ? "¿Qué problema resuelve? Contámelo como se lo contarías a un amigo" : "What problem does it solve? Tell me like you'd tell a friend"}</label>
              <textarea id="br-prob" {...campo("problema")} maxLength={1200} placeholder={es ? "Ej: hoy los turnos los anoto en un cuaderno y se me pisan…" : "e.g. today I write bookings in a notebook and they overlap…"} />
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <h3 style={{ marginTop: 0 }}>{es ? "¿Qué tiene que poder hacer? (tocá todas las que quieras)" : "What should it do? (tap as many as you like)"}</h3>
            <Pills grupo="funciones" valor={b.funciones} onChange={set("funciones")} multi lang={lang} />
            <div className="campo" style={{ marginTop: 16 }}>
              <label htmlFor="br-idea">{es ? "Contame cómo lo imaginás: pantallas, pasos, ideas sueltas" : "Describe how you picture it: screens, steps, loose ideas"}</label>
              <textarea id="br-idea" {...campo("idea")} maxLength={2000} />
            </div>
            <div className="campo">
              <label htmlFor="br-ref">{es ? "Sitios o apps que te gusten de referencia (opcional)" : "Sites or apps you like as reference (optional)"}</label>
              <input id="br-ref" {...campo("referencias")} maxLength={400} placeholder="https://…" />
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <h3 style={{ marginTop: 0 }}>{es ? "¿Qué existe hoy?" : "What exists today?"}</h3>
            <Pills grupo="hoy" valor={b.hoy} onChange={set("hoy")} lang={lang} />
            <h3>{es ? "Textos, fotos y logo" : "Texts, photos and logo"}</h3>
            <Pills grupo="contenido" valor={b.contenido} onChange={set("contenido")} lang={lang} />
            <h3>{es ? "¿Dónde lo imaginás?" : "Where do you picture it?"}</h3>
            <Pills grupo="plataforma" valor={b.plataforma} onChange={set("plataforma")} lang={lang} />
          </>
        )}

        {paso === 4 && (
          <>
            <h3 style={{ marginTop: 0 }}>{es ? "¿Para cuándo?" : "When do you need it?"}</h3>
            <Pills grupo="urgencia" valor={b.urgencia} onChange={set("urgencia")} lang={lang} />
            <div className="campo" style={{ marginTop: 14, maxWidth: 260 }}>
              <label htmlFor="br-fecha">{es ? "¿Hay una fecha clave? (lanzamiento, evento…)" : "Any key date? (launch, event…)"}</label>
              <input id="br-fecha" type="date" {...campo("fecha")} />
            </div>
            <h3>{es ? "Presupuesto (opcional)" : "Budget (optional)"}</h3>
            <Pills grupo="presupuesto" valor={b.presupuesto} onChange={set("presupuesto")} lang={lang} />
            <h3>{es ? "Después de lanzarlo…" : "After launch…"}</h3>
            <Pills grupo="mantenimiento" valor={b.mantenimiento} onChange={set("mantenimiento")} lang={lang} />
          </>
        )}

        {paso === 5 && (
          <>
            <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" value={b._hp} onChange={(e) => set("_hp")(e.target.value)} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0 14px" }}>
              <div className="campo"><label htmlFor="br-n">{es ? "¿Con quién tengo el gusto?" : "Who do I have the pleasure of?"}</label><input id="br-n" {...campo("nombre")} maxLength={40} autoComplete="name" /></div>
              <div className="campo"><label htmlFor="br-e">{es ? "Empresa o proyecto (opcional)" : "Company or project (optional)"}</label><input id="br-e" {...campo("empresa")} maxLength={80} autoComplete="organization" /></div>
              <div className="campo"><label htmlFor="br-m">Email</label><input id="br-m" type="email" {...campo("email")} maxLength={120} autoComplete="email" /></div>
              <div className="campo"><label htmlFor="br-t">{es ? "WhatsApp o teléfono" : "WhatsApp or phone"}</label><input id="br-t" type="tel" {...campo("telefono")} maxLength={40} autoComplete="tel" /></div>
            </div>
            <h3 style={{ marginTop: 4 }}>{es ? "¿Cómo preferís que te responda?" : "How should I reply?"}</h3>
            <Pills grupo="canal" valor={b.canal} onChange={set("canal")} lang={lang} />
            <details style={{ marginTop: 16 }}>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>{es ? "👀 Ver el resumen de tu pedido" : "👀 See your request summary"}</summary>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-body)", fontSize: "0.82rem", background: "var(--surface-2)", padding: 14, borderRadius: 14, border: "1px solid var(--line)" }}>{resumen()}</pre>
            </details>
            {estado === "faltan" && <p className="aviso err">{es ? "Necesito tu nombre y un email o teléfono para responderte." : "I need your name and an email or phone to reply."}</p>}
            {estado === "email" && <p className="aviso err">{es ? "Revisá el email, parece que tiene un error." : "Check your email, it looks wrong."}</p>}
            {estado === "limite" && <p className="aviso err">{es ? "Ya recibí varios pedidos tuyos. ¡Te respondo pronto!" : "I've already received several requests from you. I'll reply soon!"}</p>}
            {estado === "lenguaje" && !malas.length && <p className="aviso err">{es ? "Revisá el pedido: tiene lenguaje que no va en este espacio 🙏" : "Check your request: it has language that doesn't belong here 🙏"}</p>}
            {estado === "error" && <p className="aviso err">{es ? "No se pudo enviar. Mandámelo por WhatsApp con el botón de abajo." : "It didn't go through. Send it via WhatsApp with the button below."}</p>}
          </>
        )}

        {paso === 6 && (
          <div className="resultado">
            <p style={{ marginTop: 0 }}>
              {es ? "Tu pedido me llegó" : "Your request arrived"}
              {nro ? <> {es ? "con el número" : "as"} <b>#{nro}</b></> : null}. {es ? "Lo leo, lo pienso y te respondo por" : "I'll read it, think it through and reply via"} <b>{OPC.canal[b.canal]?.[lang] || "email"}</b>.
            </p>
            <p>{es ? `Tu brief quedó ${completo}% completo ${medalla}. ¡Gracias por tomarte el tiempo!` : `Your brief is ${completo}% complete ${medalla}. Thanks for taking the time!`}</p>
            <div className="acciones">
              <a className="btn wa" href={`https://wa.me/${LINKS.whatsapp}?text=${encodeURIComponent(textoWa())}`} target="_blank" rel="noopener noreferrer"><Whatsapp width={16} height={16} /> {es ? "Avisarle por WhatsApp" : "Ping on WhatsApp"}</a>
              <button className="btn ghost small" onClick={onClose}>{es ? "Seguir explorando" : "Keep exploring"} 🍄</button>
            </div>
          </div>
        )}

        {paso < 6 && <AvisoFiltro palabras={malas} />}
        {paso < 6 && (
          <div className="acciones" style={{ justifyContent: "space-between" }}>
            <button className="btn ghost small" onClick={() => (paso ? setPaso(paso - 1) : onClose())}>← {paso ? (es ? "Atrás" : "Back") : es ? "Cerrar" : "Close"}</button>
            {paso < 5 ? (
              <button className="btn" onClick={() => setPaso(paso + 1)}>{es ? "Siguiente →" : "Next →"}</button>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {!malas.length && <a className="btn wa small" href={`https://wa.me/${LINKS.whatsapp}?text=${encodeURIComponent(textoWa())}`} target="_blank" rel="noopener noreferrer"><Whatsapp width={14} height={14} /> WhatsApp</a>}
                <button className="btn" onClick={enviar} disabled={estado === "enviando" || malas.length > 0}>{estado === "enviando" ? (es ? "Enviando…" : "Sending…") : es ? "Enviar pedido 🚀" : "Send request 🚀"}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
