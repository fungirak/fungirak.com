"use client";
// Reglas (funciones 20, 21, 22 y 24): por app, modo solo lectura, registro cerrado y pausar publicaciones, comentarios o
// mensajes; huellas de conexión bloqueadas; y la lista de palabras prohibidas común a todas. Las aplica el proxy.js de cada
// app (tarda hasta 1 minuto en tomar el cambio). Nunca frena entrar, salir ni recuperar la cuenta.
import { useEffect, useState } from "react";
import { APPS_PANEL } from "@/lib/panel-apps";
import { fechaHora, num, pedir, useConfirmar } from "./api";

const host = (u) => new URL(u).host;
const INTERRUPTORES = [["solo_lectura", "Solo lectura"], ["registro_cerrado", "Registro cerrado"], ["publicaciones", "Publicaciones"], ["comentarios", "Comentarios"], ["mensajes", "Mensajes"]];

export default function Reglas({ llave, toast }) {
  const [reglas, setReglas] = useState(null), [palabras, setPalabras] = useState(""), [guardando, setGuardando] = useState("");
  const [conf, ventana] = useConfirmar();
  useEffect(() => { pedir(llave, "cuenta", "/api/admin?que=reglas").then((r) => { if (!r.ok) { setReglas({}); return; } setReglas(Object.fromEntries((r.d.apps || []).map((x) => [x.host, x]))); setPalabras((r.d.palabras || []).join("\n")); }); }, [llave]);
  const apps = APPS_PANEL.filter((a) => a.tipo !== "otro");
  const de = (h) => reglas?.[h] || { host: h, solo_lectura: false, registro_cerrado: false, apagado: {}, huellas: [] };
  const valor = (r, k) => (k === "solo_lectura" || k === "registro_cerrado" ? !!r[k] : !!r.apagado?.[k]);
  const guardar = async (h, nuevo, texto) => {
    if (texto) { const c = await conf({ t: texto.t, d: texto.d, motivo: false, boton: "Aplicar", peligro: texto.peligro }); if (!c) return; }
    setGuardando(h);
    const r = await pedir(llave, "cuenta", "/api/admin", "POST", { accion: "reglas", host: h, solo_lectura: nuevo.solo_lectura, registro_cerrado: nuevo.registro_cerrado, apagado: nuevo.apagado, huellas: nuevo.huellas });
    setGuardando("");
    if (!r.ok) return toast(r.d.error || "No se pudo.");
    setReglas((x) => ({ ...x, [h]: { ...nuevo, cambiado: new Date().toISOString() } }));
    toast("Guardado: la app lo toma en menos de 1 minuto.");
  };
  const alternar = (a, k) => {
    const h = host(a.url), r = de(h), v = !valor(r, k);
    const nuevo = k === "solo_lectura" || k === "registro_cerrado" ? { ...r, [k]: v } : { ...r, apagado: { ...r.apagado, [k]: v } };
    const nombre = INTERRUPTORES.find(([x]) => x === k)[1];
    guardar(h, nuevo, v && k === "solo_lectura" ? { t: `Poner ${a.nombre} en solo lectura`, d: "Nadie puede publicar ni cambiar nada (sí entrar y mirar) hasta que lo saques.", peligro: true } : v ? { t: `${k === "registro_cerrado" ? "Cerrar el registro" : `Pausar ${nombre.toLowerCase()}`} en ${a.nombre}` } : null);
  };
  const quitarHuella = (a, hu) => { const h = host(a.url), r = de(h); guardar(h, { ...r, huellas: r.huellas.filter((x) => x !== hu) }); };
  const guardarPalabras = async () => {
    const lista = palabras.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
    const c = await conf({ t: "Guardar las palabras prohibidas", d: `${lista.length} palabras, para todas las apps. Los textos que las tengan no se publican (aviso amable a la persona).`, motivo: false, boton: "Guardar" }); if (!c) return;
    const r = await pedir(llave, "cuenta", "/api/admin", "POST", { accion: "palabras", lista });
    toast(r.ok ? `Guardadas ${num(r.d.n)} palabras.` : r.d.error || "No se pudo.");
  };
  const activas = Object.values(reglas || {}).filter((r) => r.solo_lectura || r.registro_cerrado || Object.values(r.apagado || {}).some(Boolean));

  return (<div style={{ display: "grid", gap: 12 }}>
    {ventana}
    {activas.length > 0 && <p className="pn-alerta">Hay reglas activas en: {activas.map((r) => apps.find((a) => host(a.url) === r.host)?.nombre || r.host).join(", ")}.</p>}
    <section className="pn-card pn-tabla-caja"><h2 className="pn-h-tabla">Interruptores por app <small className="pn-nota">· se aplican en menos de 1 minuto</small></h2>
      {!reglas ? <p className="pn-nota" style={{ padding: 16 }}>Cargando…</p> :
        <table className="pn-tabla"><thead><tr><th>App</th>{INTERRUPTORES.map(([k, t]) => <th key={k} style={{ textAlign: "center" }}>{k === "solo_lectura" || k === "registro_cerrado" ? t : `${t} pausadas`}</th>)}<th className="n">Huellas</th></tr></thead>
          <tbody>{apps.map((a) => { const h = host(a.url), r = de(h); return (
            <tr key={a.id} style={{ opacity: guardando === h ? 0.5 : 1 }}>
              <td className="pn-nw"><b>{a.emoji} {a.nombre}</b>{r.cambiado && <small className="pn-nota" style={{ display: "block" }}>cambiado {fechaHora(r.cambiado)}</small>}</td>
              {INTERRUPTORES.map(([k]) => <td key={k} style={{ textAlign: "center" }}><button type="button" className={`pn-sw${valor(r, k) ? " on" : ""}${k === "solo_lectura" ? " rojo" : ""}`} role="switch" aria-checked={valor(r, k)} aria-label={`${k} en ${a.nombre}`} onClick={() => alternar(a, k)} disabled={!!guardando}><i /></button></td>)}
              <td className="n">{r.huellas?.length ? <details><summary>{r.huellas.length}</summary>{r.huellas.map((hu) => <div key={hu} className="pn-meta" style={{ justifyContent: "flex-end" }}><code>{hu.slice(0, 10)}…</code><button type="button" className="pn-link" onClick={() => quitarHuella(a, hu)}>quitar</button></div>)}</details> : "—"}</td>
            </tr>); })}</tbody></table>}
    </section>
    <section className="pn-card"><h2>Palabras prohibidas <small className="pn-nota">· para todas las apps, una por línea</small></h2>
      <p className="pn-nota" style={{ marginBottom: 8 }}>Se suman a los filtros propios de cada app (insultos, enlaces, teléfonos). No importa mayúsculas ni tildes.</p>
      <textarea className="pn-in" rows={6} value={palabras} onChange={(e) => setPalabras(e.target.value)} placeholder={"casino online\nseguidores baratos"} />
      <div style={{ marginTop: 10 }}><button type="button" className="pn-b" onClick={guardarPalabras}>Guardar palabras</button></div>
    </section>
    <p className="pn-nota">Para bloquear una conexión: en <b>Auditoría</b>, tocá «Bloquear» en un evento. Para frenar a una persona en todas las apps: en <b>Personas</b>, «Suspender».</p>
  </div>);
}
