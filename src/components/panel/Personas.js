"use client";
// Personas (funciones 11 a 17): buscador de cuentas FUNGIRAK, ficha con su historial y en qué apps tiene perfil, y acciones:
// suspender / reactivar, cerrar todas sus sesiones, reenviar el mail, dar días de plan, exportar sus datos y pedir la baja;
// en cada app: cerrar sus sesiones o limpiar su perfil. Todo con confirmación y motivo (queda en la auditoría).
import { useEffect, useState } from "react";
import { APPS_PANEL } from "@/lib/panel-apps";
import { Info, fecha, fechaHora, num, pedir, pedirATodas, useConfirmar } from "./api";

export default function Personas({ llave, toast }) {
  const [q, setQ] = useState(""), [lista, setLista] = useState(null), [err, setErr] = useState("");
  const [sel, setSel] = useState(null), [hist, setHist] = useState(null), [enApps, setEnApps] = useState(null);
  const [conf, ventana] = useConfirmar();
  const buscar = async (t = q) => {
    setErr(""); const r = await pedir(llave, "cuenta", `/api/admin?que=personas&q=${encodeURIComponent(t.replace(/^@/, ""))}`);
    if (!r.ok) { setErr(r.d.error || "No se pudo buscar."); setLista([]); } else setLista(r.d.filas || []);
  };
  useEffect(() => { buscar(""); }, []); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect -- las últimas cuentas al entrar
  useEffect(() => {
    if (!sel) return;
    let vivo = true;
    setHist(null); setEnApps(null); // eslint-disable-line react-hooks/set-state-in-effect -- nueva ficha
    pedir(llave, "cuenta", `/api/admin?que=auditoria&q=${encodeURIComponent(sel.usuario)}`).then((r) => vivo && setHist(r.ok ? r.d.filas || [] : []));
    pedirATodas(llave, APPS_PANEL.filter((a) => a.tipo !== "otro"), `/api/admin/personas?apodo=${encodeURIComponent(sel.usuario)}`)
      .then((rs) => vivo && setEnApps(rs.filter((x) => x.ok && x.d.persona).map((x) => ({ app: x.app, datos: x.d.persona.datos }))));
    return () => { vivo = false; };
  }, [sel, llave]);

  const hacer = async (t, d, cuerpo, { peligro, boton } = {}) => {
    const c = await conf({ t, d, peligro, boton }); if (!c) return;
    const r = await pedir(llave, "cuenta", "/api/admin", "POST", { ...cuerpo, motivo: c.motivo });
    toast(r.ok ? "Listo." : r.d.error || "No se pudo.");
    if (r.ok) { await buscar(); setSel((s) => (s ? { ...s, bloqueado: cuerpo.accion === "suspender" ? true : cuerpo.accion === "reactivar" ? false : s.bloqueado } : s)); }
  };
  const dias = async () => {
    const c = await conf({ t: `Dar días de plan a @${sel.usuario}`, valor: "Cantidad de días (1 a 365)", valorInicial: "30", boton: "Dar días" }); if (!c) return;
    const r = await pedir(llave, "cuenta", "/api/admin", "POST", { accion: "dias", usuario: sel.usuario, dias: Math.min(365, Math.max(1, Number(c.valor) || 0)), motivo: c.motivo });
    toast(r.ok ? `Le diste ${c.valor} días.` : r.d.error || "No se pudo.");
  };
  const exportar = async () => {
    const r = await pedir(llave, "cuenta", `/api/admin?que=exportar&usuario=${encodeURIComponent(sel.usuario)}`);
    if (!r.ok) return toast(r.d.error || "No se pudo.");
    const url = URL.createObjectURL(new Blob([JSON.stringify(r.d, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `cuenta-fungirak-${sel.usuario}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast("Datos descargados (queda registrado).");
  };
  const enApp = async (app, accion) => {
    const c = await conf({ t: accion === "limpiar" ? `Limpiar el perfil de @${sel.usuario} en ${app.nombre}` : `Cerrar las sesiones de @${sel.usuario} en ${app.nombre}`,
      d: accion === "limpiar" ? "Saca foto, nombre y bio. Lo anterior queda guardado 180 días." : "Tiene que volver a entrar en esa app.", peligro: accion === "limpiar" }); if (!c) return;
    const r = await pedir(llave, app.id, "/api/admin/personas", "POST", { apodo: sel.usuario, accion, motivo: c.motivo });
    toast(r.ok ? r.d.mensaje || "Listo." : r.d.error || "No se pudo.");
  };

  return (<>
    {ventana}
    <div className="pn-barra-filtros">
      <form style={{ display: "contents" }} onSubmit={(e) => { e.preventDefault(); buscar(); }}>
        <input className="pn-in" type="search" placeholder="Buscar por usuario (@…)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar persona" />
        <button className="pn-b">Buscar</button>
      </form>
    </div>
    {err && <p className="pn-alerta">{err}</p>}
    <div className="pn-cols">
      <section className="pn-card"><h2>{q ? "Resultados" : "Últimas cuentas"}<Info t="Cuentas FUNGIRAK (la cuenta única que sirve para todas las apps). Buscá por usuario." /></h2>
        {!lista ? <p className="pn-nota">Cargando…</p> : !lista.length ? <p className="pn-nota">No hay cuentas con ese usuario.</p> :
          <ul className="pn-lista-p">{lista.map((p) => <li key={p.id}><button type="button" className={sel?.id === p.id ? "on" : ""} onClick={() => setSel(p)}>
            <span><b>@{p.usuario}</b> {p.bloqueado && <span className="pn-chip mal">Suspendida</span>}</span>
            <small>{p.nombre || "Sin nombre"} · alta {fecha(p.creado)} · {p.apps} apps</small></button></li>)}</ul>}
      </section>
      <section className="pn-card">
        {!sel ? <p className="pn-nota">Elegí una cuenta para ver su ficha.</p> : <>
          <h2>@{sel.usuario} {sel.bloqueado ? <span className="pn-chip mal">Suspendida</span> : <span className="pn-chip ok">Activa</span>}</h2>
          <dl className="pn-ficha">
            {[["Nombre", sel.nombre || "—"], ["Alta", fechaHora(sel.creado)], ["Última vez", fechaHora(sel.visto)], ["Mail", sel.email_ok ? "Confirmado" : "Sin confirmar"],
              ["Dos pasos", sel.dos_pasos ? "Sí" : "No"], ["Edad", sel.edad || "—"], ["Apps vinculadas", num(sel.apps)], ["Llegó por", sel.origen || "—"]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="pn-acc" style={{ marginTop: 14 }}><Info t="Suspender: no entra a ninguna app. Cerrar sesiones: la saca de todos lados pero puede volver a entrar. Días de plan: regala días de un plan pago. Exportar: baja todo lo que la cuenta guarda de esa persona. Baja: solo si la persona lo pidió; se borra en 5 días. Todo queda en la auditoría." />
            {sel.bloqueado
              ? <button type="button" className="pn-b" onClick={() => hacer(`Reactivar @${sel.usuario}`, "Vuelve a poder entrar.", { id: sel.id, accion: "reactivar" })}>Reactivar</button>
              : <button type="button" className="pn-b pn-b-rojo" onClick={() => hacer(`Suspender @${sel.usuario}`, "No puede entrar y se cierran sus sesiones en la cuenta y en todas las apps.", { id: sel.id, accion: "suspender" }, { peligro: true, boton: "Suspender" })}>Suspender</button>}
            <button type="button" className="pn-b pn-b2" onClick={() => hacer(`Cerrar todas las sesiones de @${sel.usuario}`, "En la cuenta y en todas las apps. Puede volver a entrar con su clave.", { id: sel.id, accion: "salir" })}>Cerrar sesiones</button>
            {!sel.email_ok && <button type="button" className="pn-b pn-b2" onClick={() => hacer(`Reenviar el mail de confirmación a @${sel.usuario}`, "", { id: sel.id, accion: "reenviar" })}>Reenviar mail</button>}
            <button type="button" className="pn-b pn-b2" onClick={dias}>Dar días de plan</button>
            <button type="button" className="pn-b pn-b2" onClick={exportar}>Exportar sus datos</button>
            <button type="button" className="pn-b pn-b-peligro" onClick={() => hacer(`Pedir la baja de @${sel.usuario}`, "Solo si la persona lo pidió (Ley 25.326). Se borra en 5 días; si entra antes, se cancela. Le llega un mail.", { id: sel.id, accion: "baja" }, { peligro: true, boton: "Pedir la baja" })}>Baja (pedido legal)</button>
          </div>
          <h2 style={{ marginTop: 20 }}>En qué apps tiene perfil<Info t="Las apps donde existe un perfil con el mismo usuario. Limpiar perfil saca foto, nombre y bio (se guarda 180 días por si hay que mostrarlo a una autoridad)." /></h2>
          {!enApps ? <p className="pn-nota">Buscando en {APPS_PANEL.length} apps…</p> : !enApps.length ? <p className="pn-nota">No tiene perfil con este usuario en las apps con panel.</p> :
            <div style={{ display: "grid", gap: 10 }}>{enApps.map(({ app, datos }) => <div key={app.id} className="pn-item">
              <p><b>{app.emoji} {app.nombre}</b></p>
              <div className="pn-meta">{["publicaciones", "comentarios", "denuncias_recibidas", "sesiones_abiertas", "la_bloquearon"].filter((k) => datos[k] !== undefined).map((k) => <span key={k}>{k.replace(/_/g, " ")}: <b>{num(datos[k])}</b></span>)}</div>
              <div className="pn-acc"><button type="button" className="pn-b pn-b2" onClick={() => enApp(app, "cerrar_sesiones")}>Cerrar sesiones acá</button><button type="button" className="pn-b pn-b-peligro" onClick={() => enApp(app, "limpiar")}>Limpiar perfil</button></div>
            </div>)}</div>}
          <h2 style={{ marginTop: 20 }}>Historial en la cuenta<Info t="Lo que hizo con su cuenta FUNGIRAK: entradas, cambios, vínculos con apps. Nunca se guarda la IP." /></h2>
          {!hist ? <p className="pn-nota">Cargando…</p> : !hist.length ? <p className="pn-nota">Sin eventos.</p> :
            <div className="pn-tabla-caja"><table className="pn-tabla"><thead><tr><th>Cuándo</th><th>Evento</th><th>App</th><th className="pn-solo-ancho">Desde</th></tr></thead>
              <tbody>{hist.slice(0, 50).map((h, i) => <tr key={i}><td className="pn-nw">{fechaHora(h.creado)}</td><td><code className="pn-ev">{h.evento}</code></td><td>{h.cliente || "—"}</td><td className="pn-solo-ancho">{[h.dispositivo, h.pais].filter(Boolean).join(" · ") || "—"}</td></tr>)}</tbody></table></div>}
        </>}
      </section>
    </div>
  </>);
}
