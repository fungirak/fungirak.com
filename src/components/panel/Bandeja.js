"use client";
// Bandeja única de moderación (funciones 18 y 19): lo denunciado u oculto de TODAS las apps en una lista, con filtros y
// acciones (restaurar o borrar). En lote: elegís varias cosas, o «todo lo de esta cuenta», y se resuelven juntas.
import { useCallback, useEffect, useMemo, useState } from "react";
import { APPS_PANEL } from "@/lib/panel-apps";
import { fechaHora, num, pedir, pedirATodas, useConfirmar } from "./api";

const TIPOS = { pub: "Publicación", com: "Comentario", msg: "Mensaje", prop: "Propuesta" };
const CLAVES = [["publicaciones", "pub"], ["comentarios", "com"], ["mensajes", "msg"], ["propuestas", "prop"]];

export default function Bandeja({ llave, toast }) {
  const [items, setItems] = useState(null), [fallas, setFallas] = useState([]), [cargando, setCargando] = useState(false);
  const [app, setApp] = useState(""), [tipo, setTipo] = useState(""), [q, setQ] = useState(""), [sel, setSel] = useState(() => new Set());
  const [conf, ventana] = useConfirmar();
  const cargar = useCallback(async () => {
    setCargando(true);
    const rs = await pedirATodas(llave, APPS_PANEL.filter((a) => a.tipo !== "otro"), "/api/moderacion");
    const out = [];
    for (const r of rs) if (r.ok) for (const [k, t] of CLAVES) for (const x of r.d[k] || []) out.push({ ...x, tipo: t, app: r.app, clave: `${r.app.id}:${t}:${x.id}` });
    out.sort((a, b) => (b.oculto === true) - (a.oculto === true) || (b.denuncias || 0) - (a.denuncias || 0) || new Date(b.creado) - new Date(a.creado));
    setItems(out); setFallas(rs.filter((r) => !r.ok).map((r) => r.app.nombre)); setSel(new Set()); setCargando(false);
  }, [llave]);
  useEffect(() => { cargar(); }, [cargar]); // eslint-disable-line react-hooks/set-state-in-effect -- carga al entrar

  const lista = useMemo(() => (items || []).filter((x) => (!app || x.app.id === app) && (!tipo || x.tipo === tipo) && (!q || `${x.texto} ${x.apodo}`.toLowerCase().includes(q.toLowerCase()))), [items, app, tipo, q]);
  const elegir = (k) => setSel((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const resolver = async (cuales, accion) => {
    if (!cuales.length) return;
    const c = await conf({ t: `${accion === "borrar" ? "Borrar" : "Restaurar"} ${cuales.length === 1 ? "esto" : `${cuales.length} cosas`}`,
      d: accion === "borrar" ? "Se borra de la app (queda guardado 180 días por si hay que mostrarlo a una autoridad)." : "Vuelve a verse y se descartan sus denuncias.", peligro: accion === "borrar", boton: accion === "borrar" ? "Borrar" : "Restaurar" });
    if (!c) return;
    let ok = 0;
    for (const x of cuales) { const r = await pedir(llave, x.app.id, "/api/moderacion", "POST", { tipo: x.tipo, id: x.id, accion, motivo: c.motivo }); if (r.ok) ok++; }
    toast(`${ok} de ${cuales.length} resueltas.`);
    setItems((l) => l.filter((x) => !cuales.some((y) => y.clave === x.clave) || false));
    setSel(new Set());
  };
  const deCuenta = (x) => (items || []).filter((y) => y.app.id === x.app.id && y.apodo === x.apodo);
  const elegidos = (items || []).filter((x) => sel.has(x.clave));
  const apps = [...new Map((items || []).map((x) => [x.app.id, x.app])).values()];
  // 23: reglas automáticas de detección — una cuenta con 3 o más cosas denunciadas u ocultas, o denunciada en 2 o más apps,
  // aparece arriba como posible spam, con la acción en lote lista.
  const sospechosos = Object.values((items || []).filter((x) => x.apodo).reduce((m, x) => { const k = x.apodo; (m[k] ||= { apodo: k, items: [], apps: new Set(), denuncias: 0 }); m[k].items.push(x); m[k].apps.add(x.app.nombre); m[k].denuncias += x.denuncias || 0; return m; }, {}))
    .filter((g) => g.items.length >= 3 || g.apps.size >= 2).sort((a, b) => b.items.length - a.items.length);

  return (<>
    {ventana}
    <div className="pn-barra-filtros">
      <select className="pn-in" value={app} onChange={(e) => setApp(e.target.value)} aria-label="App"><option value="">Todas las apps</option>{apps.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select>
      <div className="pn-seg">{[["", "Todo"], ...Object.entries(TIPOS)].map(([v, t]) => <button key={t} type="button" className={tipo === v ? "on" : ""} onClick={() => setTipo(v)}>{t}</button>)}</div>
      <input className="pn-in" type="search" placeholder="Buscar texto o usuario" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
      <button type="button" className="pn-b pn-b2" onClick={cargar} disabled={cargando}>{cargando ? "Revisando las apps…" : "Actualizar"}</button>
    </div>
    {fallas.length > 0 && <p className="pn-alerta chica">No respondieron: {fallas.join(", ")}.</p>}
    {sospechosos.length > 0 && <section className="pn-card"><h2>⚠️ Posibles cuentas de spam <small className="pn-nota">· 3 o más cosas denunciadas, o en 2 o más apps</small></h2>
      <div style={{ display: "grid", gap: 8 }}>{sospechosos.map((g) => <div key={g.apodo} className="pn-item"><div className="pn-meta"><b style={{ color: "var(--t)" }}>@{g.apodo}</b><span>{g.items.length} cosas</span><span>{num(g.denuncias)} denuncias</span><span>en {[...g.apps].join(", ")}</span></div>
        <div className="pn-acc"><button type="button" className="pn-b pn-b-rojo" onClick={() => resolver(g.items, "borrar")}>Borrar todo ({g.items.length})</button><span className="pn-nota">Para frenarla en todas las apps: Personas → @{g.apodo} → Suspender.</span></div></div>)}</div>
    </section>}
    {elegidos.length > 0 && <div className="pn-card pn-acc" style={{ position: "sticky", top: 8, zIndex: 5 }}>
      <b>{elegidos.length} elegidas</b>
      <button type="button" className="pn-b pn-b-rojo" onClick={() => resolver(elegidos, "borrar")}>Borrar</button>
      <button type="button" className="pn-b pn-b2" onClick={() => resolver(elegidos, "restaurar")}>Restaurar</button>
      <button type="button" className="pn-b pn-b2" onClick={() => setSel(new Set())}>Deshacer selección</button>
    </div>}
    {!items ? <div className="pn-card"><p className="pn-nota">Revisando {APPS_PANEL.length} apps…</p></div>
      : !lista.length ? <p className="pn-ok-msg">No hay nada para revisar{app || tipo || q ? " con ese filtro" : " en ninguna app"}.</p>
      : <div style={{ display: "grid", gap: 10 }}>{lista.slice(0, 200).map((x) => (
        <div key={x.clave} className={`pn-item${sel.has(x.clave) ? " sel" : ""}`}>
          <div className="pn-meta"><label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={sel.has(x.clave)} onChange={() => elegir(x.clave)} /> {x.app.emoji} {x.app.nombre}</label>
            <span className="pn-chip">{TIPOS[x.tipo]}</span>{x.oculto && <span className="pn-chip mal">Oculto</span>}{x.denuncias > 0 && <span className="pn-chip mal">{num(x.denuncias)} denuncias</span>}
            <span>@{x.apodo || "?"}</span><span>{fechaHora(x.creado)}</span></div>
          <p>{x.texto || <i className="pn-nota">(sin texto{x.foto ? ", con foto" : ""})</i>}</p>
          <div className="pn-acc">
            <button type="button" className="pn-b pn-b2" onClick={() => resolver([x], "restaurar")}>Restaurar</button>
            <button type="button" className="pn-b pn-b-peligro" onClick={() => resolver([x], "borrar")}>Borrar</button>
            {deCuenta(x).length > 1 && <button type="button" className="pn-b pn-b-peligro" onClick={() => resolver(deCuenta(x), "borrar")}>Borrar todo lo de @{x.apodo} ({deCuenta(x).length})</button>}
          </div>
        </div>))}</div>}
  </>);
}
