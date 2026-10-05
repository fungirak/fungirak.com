"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { LINKS } from "@/data/perfil";

const TIERS = [
  { id: "cafe", ico: "☕", es: ["Un café para el Studio", "Una noche más de código para la próxima guía de Santa Fe."], en: ["A coffee for the studio", "One more night of code for the next Santa Fe guide."] },
  { id: "server", ico: "🖥️", es: ["Un mes de servidor", "Que MiTour, ECOS y Atlas sigan gratis y sin publicidad."], en: ["A month of servers", "Keeping MiTour, ECOS and Atlas free and ad-free."] },
  { id: "idea", ico: "🚀", es: ["Una idea nueva al mundo", "El empujón para lanzar el próximo producto del Studio."], en: ["A new idea into the world", "The push to launch the studio's next product."] },
];

const ALIAS = "cuenta.gabi.sf";

// Alias de Mercado Pago con botón para copiar (sirve para transferir desde cualquier banco o billetera)
function Alias({ es }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(ALIAS);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };
  return (
    <div className="alias">
      <span>
        <small>{es ? "O transferí al alias" : "Or transfer to the alias"}</small>
        <b>{ALIAS}</b>
      </span>
      <button className="btn ghost small" onClick={copiar} aria-live="polite">{copiado ? (es ? "¡Copiado! ✓" : "Copied! ✓") : es ? "Copiar" : "Copy"}</button>
    </div>
  );
}

export default function Donar({ stats, abrir }) {
  const { lang } = useLang();
  const [tier, setTier] = useState("server");
  const es = lang === "es";
  return (
    <section className="band" id="donar" aria-labelledby="donar-t">
      <div className="wrap donar">
        <div>
          <div className="eyebrow">{es ? "Bancá el Studio" : "Back the studio"} 💚</div>
          <h2 className="display" id="donar-t">
            {es ? <>Todo lo que hago es <span className="grad-text">gratis</span>. Ayudame a que siga así.</> : <>Everything I build is <span className="grad-text">free</span>. Help me keep it that way.</>}
          </h2>
          <p>
            {es
              ? "MiTour, ECOS, Atlas Fit Pro y las guías de Santa Fe son gratis, sin publicidad y se usan sin registrarte. Los sostengo yo, con mi tiempo. Si alguno te sirvió, tu aporte paga servidores, dominios y horas de código para el próximo."
              : "MiTour, ECOS, Atlas Fit Pro and the Santa Fe guides are free, ad-free and work without signing up. I keep them alive on my own time. If one of them helped you, your support pays for servers, domains and coding hours for the next one."}
          </p>
          <div className="contadores">
            <div><b className="grad-text">8</b><span>{es ? "productos en línea" : "live products"}</span></div>
            <div><b className="grad-text">0</b><span>{es ? "publicidades" : "ads"}</span></div>
            <div><b className="grad-text">{stats?.visitas ? stats.visitas.toLocaleString(lang) : "—"}</b><span>{es ? "visitas a este sitio" : "visits to this site"}</span></div>
          </div>
          <p style={{ fontSize: "0.86rem" }}>
            {es ? "¿Preferís ayudar de otra forma? Compartí un proyecto, contale a alguien o " : "Prefer to help another way? Share a project, tell a friend or "}
            <button onClick={() => abrir("hablemos")} style={{ background: "none", border: 0, padding: 0, color: "var(--accent)", fontWeight: 700, cursor: "pointer" }}>
              {es ? "proponeme algo para construir juntos" : "pitch me something to build together"}
            </button>
            .
          </p>
        </div>
        <div className="tiers">
          {TIERS.map((t) => (
            <button key={t.id} className="tier" aria-pressed={tier === t.id} onClick={() => setTier(t.id)}>
              <span className="ico">{t.ico}</span>
              <span>
                <b>{t[lang][0]}</b>
                <span>{t[lang][1]}</span>
              </span>
            </button>
          ))}
          <a className="btn pulse" href={LINKS.mercadopago} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
            <img src="/img/logoColaboracion.png" alt="" width={22} height={22} />
            {es ? "Aportar con Mercado Pago" : "Support via Mercado Pago"}
          </a>
          <Alias es={es} />
          <small style={{ color: "var(--text-3)", textAlign: "center" }}>
            {es ? "Elegís cuánto en Mercado Pago. Gracias de corazón 🍄" : "You choose the amount on Mercado Pago. Thank you 🍄"}
          </small>
        </div>
      </div>
    </section>
  );
}
