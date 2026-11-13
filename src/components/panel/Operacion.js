"use client";
// Operación (funciones 25 a 28): cartel para todas las apps, novedades por mail a quienes las aceptaron, reintentar los mails
// con error y el estado de cada dominio.
import { useEffect, useState } from "react";
import { APPS_PANEL } from "@/lib/panel-apps";
import { cab, fechaHora, num, pedir, useConfirmar } from "./api";

export default function Operacion({ llave, toast, cola }) {
  const [conf, ventana] = useConfirmar();
  const [anuncio, setAnuncio] = useState(undefined), [dom, setDom] = useState(null), [revisando, setRevisando] = useState(false);
  const [nov, setNov] = useState({ app: "", titulo: "", texto: "", url: "", cta: "" }), [conteo, setConteo] = useState(null);
  useEffect(() => { pedir(llave, "cuenta", "/api/admin?que=anuncio").then((r) => setAnuncio(r.ok ? r.d.anuncio : null)); }, [llave]);

  const publicar = async (e) => {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const c = await conf({ t: "Publicar el cartel en todas las apps", d: "Aparece arriba de cada sitio de FUNGIRAK hasta que venza o lo saques.", motivo: false, boton: "Publicar" }); if (!c) return;
    const r = await pedir(llave, "cuenta", "/api/admin", "POST", { accion: "anuncio", texto: f.get("texto"), nivel: f.get("nivel"), enlace: f.get("enlace"), horas: f.get("horas") });
    toast(r.ok ? "Cartel publicado (tarda hasta 1 minuto en verse)." : r.d.error || "No se pudo.");
    if (r.ok) setAnuncio({ texto: f.get("texto"), nivel: f.get("nivel"), hasta: new Date(Date.now() + Number(f.get("horas")) * 36e5).toISOString() });
  };
  const quitar = async () => { const r = await pedir(llave, "cuenta", "/api/admin", "POST", { accion: "anuncio", texto: "" }); toast(r.ok ? "Cartel quitado." : "No se pudo."); if (r.ok) setAnuncio(null); };

  const difusion = async (accion) => {
    if (!nov.app || !nov.titulo || !nov.texto || !/^https:\/\/[a-z0-9.-]+\.fungirak\.com/.test(nov.url)) return toast("Completá app, título, texto y el link de la app (https://….fungirak.com).");
    if (accion === "difundir") { const c = await conf({ t: `Mandar la novedad de ${nov.app}`, d: `Le llega a ${conteo ? num(conteo.total) : "las"} personas de las otras apps que aceptaron novedades (no a quien ya usa ${nov.app}). Respeta el cupo diario y las bajas.`, motivo: false, boton: "Mandar", peligro: true }); if (!c) return; }
    const r = await pedir(llave, "correo", "/api/studio", "POST", { accion, ...nov });
    if (!r.ok || r.d.error) return toast(r.d.error || "No se pudo.");
    if (accion === "contar") { setConteo(r.d); toast(`Le llegaría a ${num(r.d.total || 0)} personas.`); }
    else toast(accion === "prueba" ? "Te mandamos la prueba a fungirak@gmail.com." : `Encolados ${num(r.d.total || 0)} mails: salen de a poco, respetando el cupo.`);
  };
  const reintentar = async () => {
    const c = await conf({ t: "Reintentar los mails con error", d: "Los de los últimos 7 días vuelven a la cola y salen en la próxima tanda.", motivo: false, boton: "Reintentar" }); if (!c) return;
    const r = await pedir(llave, "correo", "/api/admin", "POST", { accion: "reintentar" });
    toast(r.ok ? `${num(r.d.reintentados)} mails vuelven a la cola.` : r.d.error || "No se pudo.");
  };
  const revisarDom = async () => {
    setRevisando(true);
    const r = await fetch("/api/panel/dns", { headers: cab(llave), cache: "no-store" }).then((x) => x.json()).catch(() => ({ error: "Sin conexión." }));
    setDom(r); setRevisando(false);
  };
  const errores = Object.values(cola || {}).reduce((t, x) => t + (x.error || 0), 0);
  const nombres = [...new Set(APPS_PANEL.map((a) => a.nombre))].sort();

  return (<div style={{ display: "grid", gap: 12 }}>
    {ventana}
    <section className="pn-card"><h2>📣 Cartel en todas las apps</h2>
      {anuncio === undefined ? <p className="pn-nota">Cargando…</p> : anuncio
        ? <div className="pn-item"><p><b>Publicado:</b> {anuncio.texto}</p><div className="pn-meta"><span className="pn-chip">{anuncio.nivel}</span><span>hasta {fechaHora(anuncio.hasta)}</span></div><div className="pn-acc"><button type="button" className="pn-b pn-b-peligro" onClick={quitar}>Sacar el cartel</button></div></div>
        : <p className="pn-nota" style={{ marginBottom: 10 }}>No hay ningún cartel publicado.</p>}
      <form onSubmit={publicar} style={{ display: "grid", gap: 10, marginTop: 10 }}>
        <label className="pn-campo">Texto<input className="pn-in" name="texto" required maxLength={220} placeholder="Ej.: Esta noche hacemos mantenimiento de 2 a 3 h." /></label>
        <div className="pn-barra-filtros">
          <label className="pn-campo" style={{ flex: "1 1 140px" }}>Tipo<select className="pn-in" name="nivel" defaultValue="info"><option value="info">Novedad</option><option value="aviso">Aviso</option><option value="urgente">Urgente</option></select></label>
          <label className="pn-campo" style={{ flex: "1 1 140px" }}>Durante<select className="pn-in" name="horas" defaultValue="24"><option value="2">2 horas</option><option value="24">1 día</option><option value="72">3 días</option><option value="168">1 semana</option></select></label>
          <label className="pn-campo" style={{ flex: "2 1 240px" }}>Enlace (opcional, de fungirak.com)<input className="pn-in" name="enlace" type="url" placeholder="https://fungirak.com/…" /></label>
        </div>
        <div><button className="pn-b">Publicar cartel</button></div>
      </form>
    </section>

    <section className="pn-card"><h2>✉️ Novedades por mail</h2>
      <p className="pn-nota" style={{ marginBottom: 10 }}>Anunciá una app a la gente de las otras apps de FUNGIRAK que aceptó recibir novedades (quien ya la usa no lo recibe). Probá primero con «Mandarme una prueba».</p>
      <div style={{ display: "grid", gap: 10 }}>
        <label className="pn-campo">App que anunciás<select className="pn-in" value={nov.app} onChange={(e) => { setNov({ ...nov, app: e.target.value }); setConteo(null); }}><option value="">Elegí…</option>{nombres.map((n) => <option key={n}>{n}</option>)}</select></label>
        <label className="pn-campo">Título<input className="pn-in" value={nov.titulo} maxLength={120} onChange={(e) => setNov({ ...nov, titulo: e.target.value })} /></label>
        <label className="pn-campo">Texto<textarea className="pn-in" value={nov.texto} maxLength={1200} onChange={(e) => setNov({ ...nov, texto: e.target.value })} /></label>
        <div className="pn-barra-filtros"><input className="pn-in" type="url" placeholder="Link de la app (https://….fungirak.com)" value={nov.url} onChange={(e) => setNov({ ...nov, url: e.target.value })} /><input className="pn-in" placeholder="Texto del botón (opcional)" value={nov.cta} maxLength={60} onChange={(e) => setNov({ ...nov, cta: e.target.value })} /></div>
        <div className="pn-acc"><button type="button" className="pn-b pn-b2" onClick={() => difusion("contar")}>¿A cuántos le llega?</button><button type="button" className="pn-b pn-b2" onClick={() => difusion("prueba")}>Mandarme una prueba</button><button type="button" className="pn-b" onClick={() => difusion("difundir")}>Mandar</button></div>
      </div>
    </section>

    <section className="pn-card"><h2>🔁 Mails con error</h2>
      <p className="pn-nota" style={{ marginBottom: 10 }}>{errores ? `${num(errores)} mails quedaron con error en los últimos 7 días.` : "No hay mails con error en los últimos 7 días."}</p>
      <button type="button" className="pn-b pn-b2" onClick={reintentar} disabled={!errores}>Reintentar todos</button>
    </section>

    <section className="pn-card"><h2>🌐 Dominios</h2>
      <button type="button" className="pn-b pn-b2" onClick={revisarDom} disabled={revisando}>{revisando ? "Revisando cada dominio…" : dom ? "Revisar de nuevo" : "Revisar todos los dominios"}</button>
      {dom?.error && <p className="pn-err">{dom.error}</p>}
      {dom?.dominios && <div className="pn-tabla-caja" style={{ marginTop: 12 }}><table className="pn-tabla"><thead><tr><th>Dominio</th><th>DNS</th><th>HTTPS</th><th className="n">Tiempo</th></tr></thead>
        <tbody>{dom.dominios.map((d) => <tr key={d.host}><td><b>{d.host}</b></td><td>{d.apunta.length ? <span className={`pn-chip ${d.vercel ? "ok" : ""}`}>{d.vercel ? "Vercel" : d.apunta[0]}</span> : <span className="pn-chip mal">No resuelve</span>}</td>
          <td>{d.https ? <span className={`pn-chip ${d.https < 400 ? "ok" : "mal"}`}>{d.https}</span> : <span className="pn-chip mal">No responde</span>}</td><td className="n">{d.ms ? `${num(d.ms)} ms` : "—"}</td></tr>)}</tbody></table></div>}
    </section>
  </div>);
}
