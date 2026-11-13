"use client";
// Errores reales (función 8): los que vieron las personas en el navegador de cada app y los de la cuenta, agrupados y ordenados
// por cantidad. Se marcan como resueltos (se borran de la lista de esa app).
import { useCallback, useEffect, useMemo, useState } from "react";
import { APPS_PANEL } from "@/lib/panel-apps";
import { fechaHora, num, pedir, pedirATodas, useConfirmar } from "./api";

export default function Errores({ llave, toast }) {
  const [filas, setFilas] = useState(null), [cargando, setCargando] = useState(false), [app, setApp] = useState(""), [orden, setOrden] = useState("veces");
  const [conf, ventana] = useConfirmar();
  const cargar = useCallback(async () => {
    setCargando(true);
    const [rs, cu] = await Promise.all([pedirATodas(llave, APPS_PANEL.filter((a) => a.tipo !== "otro"), "/api/admin/errores"), pedir(llave, "cuenta", "/api/admin?que=errores")]);
    const out = [];
    for (const r of rs) if (r.ok) for (const e of r.d.errores || []) out.push({ app: r.app, huella: e.huella, mensaje: e.mensaje, donde: [e.ruta, e.fuente && `${String(e.fuente).split("/").pop()}:${e.linea || ""}`].filter(Boolean).join(" · "), navegador: e.navegador, veces: e.veces || 1, ultima: e.ultima, primera: e.primera });
    if (cu.ok) for (const e of cu.d.filas || []) out.push({ app: { id: "cuenta", nombre: "Cuenta FUNGIRAK", emoji: "🔑" }, mensaje: e.mensaje, donde: e.donde, veces: e.veces || 1, ultima: e.ultimo, primera: e.primero });
    setFilas(out); setCargando(false);
  }, [llave]);
  useEffect(() => { cargar(); }, [cargar]); // eslint-disable-line react-hooks/set-state-in-effect -- carga al entrar
  const lista = useMemo(() => (filas || []).filter((e) => !app || e.app.id === app).sort((a, b) => (orden === "veces" ? b.veces - a.veces : new Date(b.ultima) - new Date(a.ultima))), [filas, app, orden]);
  const resolver = async (e) => {
    const c = await conf({ t: "Marcar como resuelto", d: `«${String(e.mensaje).slice(0, 120)}» en ${e.app.nombre}. Si vuelve a pasar, aparece de nuevo.`, motivo: false, boton: "Resuelto" }); if (!c) return;
    const r = await pedir(llave, e.app.id, `/api/admin/errores?huella=${e.huella}`, "DELETE");
    toast(r.ok ? "Marcado como resuelto." : r.d.error || "No se pudo.");
    if (r.ok) setFilas((l) => l.filter((x) => x !== e));
  };
  const porApp = Object.values((filas || []).reduce((m, e) => { (m[e.app.id] ||= { app: e.app, n: 0, veces: 0 }); m[e.app.id].n++; m[e.app.id].veces += e.veces; return m; }, {})).sort((a, b) => b.veces - a.veces);
  return (<>
    {ventana}
    <div className="pn-barra-filtros">
      <select className="pn-in" value={app} onChange={(e) => setApp(e.target.value)} aria-label="App"><option value="">Todas las apps</option>{porApp.map((x) => <option key={x.app.id} value={x.app.id}>{x.app.nombre} ({x.n})</option>)}</select>
      <div className="pn-seg">{[["veces", "Más repetidos"], ["ultima", "Más recientes"]].map(([v, t]) => <button key={v} type="button" className={orden === v ? "on" : ""} onClick={() => setOrden(v)}>{t}</button>)}</div>
      <button type="button" className="pn-b pn-b2" onClick={cargar} disabled={cargando}>{cargando ? "Revisando…" : "Actualizar"}</button>
    </div>
    {!filas ? <div className="pn-card"><p className="pn-nota">Revisando los errores de {APPS_PANEL.length} apps…</p></div> : !lista.length ? <p className="pn-ok-msg">Sin errores registrados.</p> :
      <div className="pn-card pn-tabla-caja"><table className="pn-tabla"><thead><tr><th>Error</th><th>App</th><th className="n">Veces</th><th className="pn-solo-ancho">Última vez</th><th /></tr></thead>
        <tbody>{lista.slice(0, 150).map((e, i) => <tr key={i}>
          <td><b style={{ display: "block", overflowWrap: "anywhere" }}>{String(e.mensaje || "").slice(0, 160)}</b><small className="pn-nota">{e.donde}{e.navegador ? ` · ${e.navegador}` : ""}</small></td>
          <td className="pn-nw">{e.app.emoji} {e.app.nombre}</td><td className="n">{num(e.veces)}</td><td className="pn-solo-ancho pn-nw">{fechaHora(e.ultima)}</td>
          <td>{e.huella && <button type="button" className="pn-b pn-b2" onClick={() => resolver(e)}>Resuelto</button>}</td></tr>)}</tbody></table></div>}
  </>);
}
