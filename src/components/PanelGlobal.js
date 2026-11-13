"use client";
// Panel del estudio. Antes de entrar no dice qué es ni qué hay adentro (título «Acceso», sin enlaces desde el sitio).
// Adentro: resumen, apps (búsqueda, filtros, orden y paginación), ingresos, cuentas, correo, moderación, auditoría y estado.
// Cada sección carga por su cuenta y muestra un esqueleto mientras tanto. La contraseña maestra queda solo en esta pestaña.
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CSS_EXTRA, SESION, cab } from "./panel/api";
import Personas from "./panel/Personas";
import Bandeja from "./panel/Bandeja";
import Errores from "./panel/Errores";
import Metricas from "./panel/Metricas";
import Operacion from "./panel/Operacion";
import Reglas from "./panel/Reglas";
import { APPS_PANEL, panelDe } from "@/lib/panel-apps";
import { pedir } from "./panel/api";

const K = "panel.llave";
const num = (n) => (n === null || n === undefined || Number.isNaN(Number(n)) ? "—" : Number(n).toLocaleString("es-AR"));
const pct = (a, b) => (b ? Math.min(100, Math.round((a / b) * 100)) : 0);
const pesos = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }));
const fecha = (f) => (f ? new Date(f).toLocaleDateString("es-AR", { day: "numeric", month: "short" }) : "—");
const fechaHora = (f) => (f ? new Date(f).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) : "—");
const host = (u) => String(u || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const valor = (m, k) => Number.parseFloat((m || []).find(([x]) => x === k)?.[1]) || 0;

// Por qué una app no muestra datos, en criollo.
function motivo(a) {
  if (!a || a.ok) return null;
  if (a.codigo === 401) return { t: "Sin acceso", d: "Esta app no acepta la contraseña maestra: hay que revisar la llave FUNGIRAK_ADMIN_KEY en su Vercel." };
  if (a.codigo === 404) return { t: "Sin panel", d: "Esta app todavía no tiene publicada la parte de números del panel." };
  if (a.codigo === 429) return { t: "Trabada", d: "Demasiados intentos recientes: se destraba sola en 15 minutos." };
  if (/tiempo/i.test(a.error || "")) return { t: "Lenta", d: "No respondió a tiempo. Probá actualizar en un rato." };
  return { t: "Error", d: a.error || "No respondió." };
}

// Pide una parte del panel con la contraseña de esta pestaña.
function useParte(llave, parte, n) {
  const [st, setSt] = useState({ d: null, err: "", cargando: false });
  useEffect(() => {
    if (!llave) return;
    let vivo = true;
    setSt((s) => ({ ...s, cargando: true, err: "" })); // eslint-disable-line react-hooks/set-state-in-effect -- arranca la carga
    // si el servidor tarda o falla (5xx o sin conexión), un reintento automático antes de mostrar el error
    const ir = (n) => fetch(`/api/panel?parte=${parte}`, { method: "POST", headers: cab(llave), cache: "no-store" })
      .then(async (r) => { const j = await r.json().catch(() => ({})); if (!vivo) return; if (r.status >= 500 && n === 0) return ir(1); if (!r.ok) setSt({ d: null, err: j.error || "No se pudo.", cargando: false, codigo: r.status }); else setSt({ d: j, err: "", cargando: false }); })
      .catch(() => { if (!vivo) return; if (n === 0) return ir(1); setSt({ d: null, err: "Sin conexión.", cargando: false }); });
    ir(0);
    return () => { vivo = false; };
  }, [llave, parte, n]);
  return st;
}

const SECCIONES = [
  ["resumen", "Resumen", "M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z"],
  ["apps", "Apps", "M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"],
  ["personas", "Personas", "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"],
  ["moderacion", "Moderación", "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  ["errores", "Errores", "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"],
  ["metricas", "Métricas", "M3 3v18h18M7 15l4-4 3 3 5-6"],
  ["reglas", "Reglas", "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"],
  ["ingresos", "Ingresos", "M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
  ["cuentas", "Cuenta FK", "M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM4 22a8 8 0 0 1 16 0"],
  ["correo", "Correo", "M4 4h16v16H4zM4 6l8 7 8-7"],
  ["operacion", "Operación", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"],
  ["auditoria", "Auditoría", "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"],
  ["estado", "Estado", "M22 12h-4l-3 9L9 3l-3 9H2"],
];
const Ico = ({ d, s = 18 }) => <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

export default function Panel() {
  const [llave, setLlave] = useState("");
  const [listo, setListo] = useState(false);
  const [sec, setSec] = useState("resumen");
  const [n, setN] = useState(0);
  const [errAcceso, setErrAcceso] = useState("");
  const [aviso, setAviso] = useState("");
  const reloj = useRef(0);
  const toast = useCallback((t) => { setAviso(t); clearTimeout(reloj.current); reloj.current = setTimeout(() => setAviso(""), 3500); }, []);
  useEffect(() => {
    try { const h = location.hash.slice(1); if (SECCIONES.some(([x]) => x === h)) setSec(h); if (new URLSearchParams(location.search).get("error") === "pase") setErrAcceso("No se pudo abrir el panel con tu cuenta. Probá de nuevo."); } catch {} // eslint-disable-line react-hooks/set-state-in-effect -- estado de esta pestaña
    // primero la sesión con la Cuenta FUNGIRAK; si no hay, la clave de esta pestaña (modo viejo)
    fetch("/api/panel/entrar?yo=1", { cache: "no-store" }).then((r) => r.json()).catch(() => ({}))
      .then((j) => { if (j.admin && j.listo) setLlave(SESION); else { try { setLlave(sessionStorage.getItem(K) || ""); } catch {} } setListo(true); });
  }, []);
  const base = useParte(llave, "base", n);
  // las otras partes recién se piden cuando la clave ya fue aceptada: una clave mal escrita cuenta como un solo intento fallido
  const ok = llave && (base.d || (base.cargando && n > 0)) ? llave : "";
  const apps = useParte(ok, "apps", n), todas = useParte(ok, "todas", n);
  // si la contraseña no sirve, vuelve a la pantalla de acceso
  useEffect(() => { if (base.codigo === 401) { try { sessionStorage.removeItem(K); } catch {} if (llave === SESION) fetch("/api/panel/entrar", { method: "DELETE" }).catch(() => {}); setLlave(""); } }, [base.codigo, llave]); // eslint-disable-line react-hooks/set-state-in-effect -- contraseña rechazada
  const ir = (s) => { setSec(s); try { history.replaceState(null, "", `#${s}`); } catch {} window.scrollTo({ top: 0 }); };
  const salir = () => { try { sessionStorage.removeItem(K); } catch {} fetch("/api/panel/entrar", { method: "DELETE" }).catch(() => {}); setLlave(""); };

  // filas unificadas: las métricas del mail diario («todas») + los números en vivo («apps»)
  const filas = useMemo(() => {
    const vivo = Object.fromEntries((apps.d?.apps || []).map((a) => [host(a.url), a]));
    const t = todas.d?.todas?.apps || [];
    const out = t.map((x) => ({ id: x.id, nombre: x.nombre, emoji: x.emoji, grupo: x.grupo || "Otras", url: x.url, metricas: x.metricas || [], terr: x.error, a: vivo[host(x.url)] || null }));
    for (const a of apps.d?.apps || []) if (!out.some((o) => host(o.url) === host(a.url))) out.push({ id: a.id, nombre: a.nombre, emoji: a.emoji, grupo: "Apps", url: a.url, metricas: [], a });
    return out.map((o) => ({ ...o, cuentas: o.a?.ok ? Number(o.a.cuentas) || 0 : valor(o.metricas, "Cuentas en total"), nuevas: o.a?.ok ? Number(o.a.nuevas7 ?? o.a.nuevasHoy) || 0 : valor(o.metricas, "Cuentas nuevas (7 días)"), activas: o.a?.ok ? Number(o.a.activas7) || 0 : 0, pend: o.a?.pendientes || 0, mal: !!(o.a && !o.a.ok) || !!o.terr }));
  }, [apps.d, todas.d]);

  if (!listo) return <div className="pn" />;
  if (!llave) return <Acceso onEntrar={(v) => { try { sessionStorage.setItem(K, v); } catch {} setLlave(v); }} error={errAcceso || base.err} />;
  const cargandoAlgo = base.cargando || apps.cargando || todas.cargando;
  // barra de 0 a 100: cada parte que llega suma; mientras falta alguna, avanza de a poco para que se note que sigue trabajando
  const listas = [base, apps, todas].filter((p) => !p.cargando && (p.d || p.err)).length;
  const progreso = Math.round((listas / 3) * 100);
  const generado = base.d?.generado || apps.d?.generado;
  const malas = filas.filter((f) => f.mal).length;
  const titulo = SECCIONES.find(([x]) => x === sec)?.[1];
  return (
    <div className="pn pn-app">
      <style>{CSS + CSS_EXTRA}</style>
      {aviso && <div className="pn-toast" role="status">{aviso}</div>}
      <div className={`pn-progreso${cargandoAlgo || progreso < 100 ? " on" : ""}`} role="progressbar" aria-label="Carga del panel" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progreso}><i style={{ width: `${Math.max(progreso, cargandoAlgo ? 8 : 0)}%` }} /></div>
      <aside className="pn-side">
        <div className="pn-logo"><span className="pn-dot" />Estudio</div>
        <nav aria-label="Secciones">{SECCIONES.map(([id, t, d]) => (
          <button key={id} type="button" className={sec === id ? "on" : ""} onClick={() => ir(id)} aria-current={sec === id ? "page" : undefined}>
            <Ico d={d} /><span>{t}</span>{id === "apps" && malas > 0 && <em className="pn-cnt">{malas}</em>}
          </button>))}</nav>
        <button type="button" className="pn-salir" onClick={salir}>Salir</button>
      </aside>
      <main className="pn-main">
        <header className="pn-top">
          <div><h1>{titulo}</h1><p className="pn-sub">{cargandoAlgo || progreso < 100 ? <span className="pn-vivo">Cargando… {Math.max(progreso, 5)} %</span> : generado ? `Actualizado ${fechaHora(generado)}` : ""}</p></div>
          <div className="pn-acc"><button type="button" className="pn-b pn-b2" onClick={() => setN((x) => x + 1)} disabled={cargandoAlgo}><Ico d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" s={16} />Actualizar</button>
            <button type="button" className="pn-b pn-b2 pn-movil" onClick={salir}>Salir</button></div>
        </header>
        {base.err && base.codigo !== 401 && <p className="pn-alerta">{base.err}</p>}
        {sec === "resumen" && <Resumen filas={filas} base={base} apps={apps} todas={todas} ir={ir} />}
        {sec === "apps" && <Apps filas={filas} cargando={apps.cargando || todas.cargando} errTodas={todas.d?.todas?.error || todas.err} grupos={todas.d?.todas?.grupos || []} />}
        {sec === "ingresos" && <Ingresos pl={base.d?.planes} cargando={base.cargando} />}
        {sec === "cuentas" && <Cuentas cu={base.d?.cuenta} cargando={base.cargando} />}
        {sec === "correo" && <Correo c={base.d?.correo} cargando={base.cargando} />}
        {sec === "personas" && <Personas llave={llave} toast={toast} />}
        {sec === "moderacion" && <><Bandeja llave={llave} toast={toast} /><MuroRevision llave={llave} filas={filas} /></>}
        {sec === "errores" && <Errores llave={llave} toast={toast} />}
        {sec === "metricas" && <Metricas llave={llave} filas={filas} base={base} />}
        {sec === "reglas" && <Reglas llave={llave} toast={toast} />}
        {sec === "operacion" && <Operacion llave={llave} toast={toast} cola={base.d?.correo?.cola} />}
        {sec === "auditoria" && <AuditoriaGlobal llave={llave} toast={toast} />}
        {sec === "estado" && <Estado c={base.d?.correo} cargando={base.cargando} />}
      </main>
      <nav className="pn-tabs" aria-label="Secciones">{SECCIONES.map(([id, t, d]) => <button key={id} type="button" className={sec === id ? "on" : ""} onClick={() => ir(id)}><Ico d={d} s={20} /><span>{t}</span></button>)}</nav>
    </div>
  );
}

function Acceso({ onEntrar, error }) {
  return (
    <div className="pn pn-acceso">
      <style>{CSS}</style>
      <div className="pn-card pn-login">
        <h1>Acceso</h1>
        <a className="pn-b" href="/api/panel/entrar">Entrar con mi Cuenta FUNGIRAK</a>
        <p className="pn-nota">Te pide tu código de dos pasos.</p>
        <details className="pn-otra"><summary>Entrar con clave</summary>
          <form onSubmit={(e) => { e.preventDefault(); onEntrar(String(new FormData(e.currentTarget).get("k") || "")); }}>
            <label>Clave<input name="k" type="password" autoComplete="current-password" required minLength={16} /></label>
            <button className="pn-b pn-b2">Entrar</button>
          </form>
        </details>
        {error && <p className="pn-err" role="alert">{error}</p>}
      </div>
    </div>
  );
}

// ---------- piezas ----------
const Sk = ({ h = 16, w = "100%", r = 8 }) => <span className="pn-sk" style={{ height: h, width: w, borderRadius: r }} />;
function Kpi({ t, v, s, cargando, tono }) {
  return <div className={`pn-card pn-kpi${tono ? ` ${tono}` : ""}`}><span className="pn-kt">{t}</span>{cargando ? <><Sk h={30} w="60%" /><Sk h={12} w="40%" /></> : <><b>{v}</b>{s && <small>{s}</small>}</>}</div>;
}
function Spark({ v, alto = 32 }) {
  if (!v || v.length < 2) return <span className="pn-spark-vacio" />;
  const max = Math.max(1, ...v), w = 100;
  const pts = v.map((x, i) => `${(i / (v.length - 1)) * w},${alto - (x / max) * (alto - 3) - 1}`).join(" ");
  return <svg className="pn-spark" viewBox={`0 0 ${w} ${alto}`} preserveAspectRatio="none" aria-hidden="true"><polyline points={`0,${alto} ${pts} ${w},${alto}`} className="a" /><polyline points={pts} className="l" /></svg>;
}
const serie = (a) => (a?.dias || []).map((x) => (x.cuentas || 0) + (x.publicaciones || 0) + (x.personas || 0));
function Estado1({ f }) {
  const m = motivo(f.a) || (f.terr ? { t: "Sin métricas", d: f.terr } : null);
  if (m) return <span className="pn-chip mal" title={m.d}>{m.t}</span>;
  if (f.a?.ok) return <span className="pn-chip ok">En vivo</span>;
  return <span className="pn-chip">Diario</span>;
}
function Paginas({ p, total, por, set }) {
  const n = Math.max(1, Math.ceil(total / por));
  if (n <= 1) return null;
  return <div className="pn-pag"><span>{(p - 1) * por + 1}–{Math.min(total, p * por)} de {num(total)}</span>
    <button type="button" className="pn-b pn-b2" onClick={() => set(p - 1)} disabled={p <= 1} aria-label="Anterior">‹</button>
    <span>{p} / {n}</span>
    <button type="button" className="pn-b pn-b2" onClick={() => set(p + 1)} disabled={p >= n} aria-label="Siguiente">›</button></div>;
}
function Barra({ t, n, de, s }) {
  const p = pct(n, de);
  return <div className="pn-card pn-barra"><p><b>{t}</b><span>{num(n)} de {num(de)}</span></p><div><i style={{ width: `${p}%` }} className={p > 85 ? "alto" : ""} /></div>{s && <small>{s}</small>}</div>;
}

// ---------- secciones ----------
function Resumen({ filas, base, apps, todas, ir }) {
  const carg = apps.cargando || todas.cargando;
  const tot = (k) => filas.reduce((t, f) => t + (f[k] || 0), 0);
  const top = [...filas].sort((a, b) => b.cuentas - a.cuentas).slice(0, 8), max = Math.max(1, top[0]?.cuentas || 0);
  const malas = filas.filter((f) => f.mal);
  const c = base.d?.correo, u = c?.cupo?.usados, tp = c?.cupo?.topes;
  const caidos = (c?.estado || []).filter((s) => s.ok === false);
  const pl = base.d?.planes;
  // 7: alertas del día, de la más grave a la más leve; cada una lleva a donde se resuelve
  const errMails = Object.values(c?.cola || {}).reduce((t, x) => t + (x.error || 0), 0);
  const arrep = (pl?.arrep || []).filter((x) => x.estado === "recibido").length;
  const alertas = [
    ...caidos.map((x) => ({ n: "r", t: `${x.nombre} no responde`, d: "El vigía del correo no la pudo abrir.", ir: "estado" })),
    ...(malas.length ? [{ n: "r", t: `${malas.length} apps sin datos`, d: malas.slice(0, 5).map((f) => f.nombre).join(", ") + (malas.length > 5 ? "…" : ""), ir: "apps" }] : []),
    ...(tot("pend") > 0 ? [{ n: "a", t: `${num(tot("pend"))} cosas para revisar`, d: "Denuncias y contenido oculto en las apps.", ir: "moderacion" }] : []),
    ...(arrep ? [{ n: "a", t: `${arrep} pedidos de arrepentimiento`, d: "Hay 10 días para devolver: resolvelos en Ingresos.", ir: "ingresos" }] : []),
    ...(u && pct(u.resend_dia, tp.resend.dia) >= 80 ? [{ n: "a", t: `Cupo de mails al ${pct(u.resend_dia, tp.resend.dia)} %`, d: "Los de marketing esperan a mañana.", ir: "correo" }] : []),
    ...(errMails ? [{ n: "a", t: `${num(errMails)} mails con error`, d: "Se pueden reintentar desde Operación.", ir: "operacion" }] : []),
    ...(pl && !pl.cobro?.activo ? [{ n: "i", t: "Cobro con Mercado Pago sin activar", d: "Los planes salen de pruebas, regalos y premios.", ir: "ingresos" }] : []),
  ];
  return (<>
    <section className="pn-card"><h2>Alertas de hoy {!carg && !base.cargando && <small className="pn-nota">· {alertas.filter((x) => x.n !== "i").length ? `${alertas.filter((x) => x.n !== "i").length} para mirar` : "todo en orden"}</small>}</h2>
      {(carg || base.cargando) && !alertas.length ? <><Sk h={40} r={12} /><Sk h={40} r={12} /></> : !alertas.length ? <p className="pn-ok-msg">Todo en orden: las apps responden, los sitios están en línea y no hay nada para revisar.</p> :
        <ul className="pn-alerta-l">{alertas.map((x, i) => <li key={i} className={x.n === "r" ? "r" : x.n === "a" ? "a" : ""} onClick={() => ir(x.ir)}><div><b>{x.t}</b><small>{x.d}</small></div></li>)}</ul>}
    </section>
    <div className="pn-grid4">
      <Kpi t="Cuentas en todas las apps" v={num(tot("cuentas"))} cargando={carg && !filas.length} />
      <Kpi t="Cuentas nuevas · 7 días" v={num(tot("nuevas"))} cargando={carg && !filas.length} />
      <Kpi t="Personas activas · 7 días" v={num(tot("activas"))} cargando={apps.cargando} />
      <Kpi t="Para revisar" v={num(tot("pend"))} s="denuncias y contenido oculto" cargando={apps.cargando} tono={tot("pend") > 0 ? "aviso" : ""} />
    </div>
    <div className="pn-dos">
      <section className="pn-card"><h2>Apps con más cuentas</h2>
        {carg && !top.length ? Array.from({ length: 6 }, (_, i) => <div key={i} className="pn-rank"><Sk w="40%" /><Sk h={8} /></div>) :
          top.map((f) => <div key={f.id} className="pn-rank"><p><span>{f.emoji} {f.nombre}</span><b>{num(f.cuentas)}</b></p><div><i style={{ width: `${pct(f.cuentas, max)}%` }} /></div></div>)}
        <button type="button" className="pn-link" onClick={() => ir("apps")}>Ver todas las apps →</button>
      </section>
      <section className="pn-card">
        <h2>Mails de hoy</h2>
        {base.cargando ? <><Sk h={10} /><Sk h={10} w="80%" /></> : u ? <>
          <div className="pn-mini-barra"><span>Resend</span><div><i style={{ width: `${pct(u.resend_dia, tp.resend.dia)}%` }} /></div><b>{num(u.resend_dia)}/{num(tp.resend.dia)}</b></div>
          <div className="pn-mini-barra"><span>Gmail</span><div><i style={{ width: `${pct(u.gmail_dia, tp.gmail.dia)}%` }} /></div><b>{num(u.gmail_dia)}/{num(tp.gmail.dia)}</b></div>
        </> : <p className="pn-nota">{c?.error || "Sin datos."}</p>}
      </section>
    </div>
  </>);
}

const POR = 12;
function Apps({ filas, cargando, errTodas, grupos }) {
  const [q, setQ] = useState(""), [g, setG] = useState(""), [solo, setSolo] = useState(""), [orden, setOrden] = useState("cuentas"), [p, setP] = useState(1), [abierta, setAbierta] = useState("");
  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    let l = filas.filter((f) => (!g || f.grupo === g) && (!t || f.nombre.toLowerCase().includes(t)) && (solo !== "mal" || f.mal) && (solo !== "pend" || f.pend > 0));
    l = [...l].sort((a, b) => (orden === "nombre" ? a.nombre.localeCompare(b.nombre) : (b[orden] || 0) - (a[orden] || 0)));
    return l;
  }, [filas, q, g, solo, orden]);
  useEffect(() => { setP(1); }, [q, g, solo, orden]); // eslint-disable-line react-hooks/set-state-in-effect -- vuelve a la primera página al filtrar
  const pagina = lista.slice((p - 1) * POR, p * POR);
  const gs = grupos.length ? grupos : [...new Set(filas.map((f) => f.grupo))];
  return (<>
    <div className="pn-barra-filtros">
      <input className="pn-in" type="search" placeholder="Buscar app…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar app" />
      <div className="pn-seg">{[["", "Todas"], ...gs.map((x) => [x, x])].map(([v, t]) => <button key={t} type="button" className={g === v ? "on" : ""} onClick={() => setG(v)}>{t}</button>)}</div>
      <div className="pn-seg">{[["", "Todo"], ["mal", "Con problemas"], ["pend", "Para revisar"]].map(([v, t]) => <button key={t} type="button" className={solo === v ? "on" : ""} onClick={() => setSolo(v)}>{t}</button>)}</div>
      <label className="pn-orden">Ordenar <select className="pn-in" value={orden} onChange={(e) => setOrden(e.target.value)}><option value="cuentas">Cuentas</option><option value="nuevas">Nuevas 7 d</option><option value="activas">Activas 7 d</option><option value="nombre">Nombre</option></select></label>
    </div>
    {errTodas && <p className="pn-alerta">Las métricas del mail diario no llegaron ({errTodas}): se muestran solo las apps con panel en vivo.</p>}
    <div className="pn-card pn-tabla-caja">
      <table className="pn-tabla">
        <thead><tr><th>App</th><th className="n">Cuentas</th><th className="n pn-solo-ancho">Nuevas 7 d</th><th className="n pn-solo-ancho">Activas 7 d</th><th className="pn-solo-ancho">Últimos días</th><th>Estado</th><th /></tr></thead>
        <tbody>
          {cargando && !filas.length ? Array.from({ length: 8 }, (_, i) => <tr key={i}>{[40, 14, 14, 14, 22, 16, 10].map((w, k) => <td key={k}><Sk w={`${w * 2}%`} /></td>)}</tr>) :
            !pagina.length ? <tr><td colSpan={7} className="pn-vacio">No hay apps con ese filtro.</td></tr> :
            pagina.map((f) => { const m = motivo(f.a); const ab = abierta === f.id; return (<Fragment key={f.id}>
              <tr className={`pn-fila${ab ? " ab" : ""}`} onClick={() => setAbierta(ab ? "" : f.id)}>
                <td><span className="pn-app-n"><span className="pn-em">{f.emoji || "•"}</span><span><b>{f.nombre}</b><small>{f.grupo}{f.pend > 0 && <em className="pn-cnt">{f.pend} para revisar</em>}</small></span></span></td>
                <td className="n">{num(f.cuentas)}</td><td className="n pn-solo-ancho">{num(f.nuevas)}</td><td className="n pn-solo-ancho">{f.a?.ok ? num(f.activas) : "—"}</td>
                <td className="pn-solo-ancho"><Spark v={serie(f.a)} /></td>
                <td><Estado1 f={f} /></td>
                <td className="pn-flecha">{ab ? "▴" : "▾"}</td>
              </tr>
              {ab && <tr className="pn-detalle"><td colSpan={7}>
                {m && <p className="pn-alerta chica"><b>{m.t}:</b> {m.d}</p>}
                {f.a?.nota && <p className="pn-nota">{f.a.nota}</p>}
                {f.metricas.length > 0 ? <ul className="pn-metricas">{f.metricas.map(([k, v]) => <li key={k}><span>{k}</span><b>{String(v)}</b></li>)}</ul> : <p className="pn-nota">Sin métricas del mail diario.</p>}
                <p className="pn-acc">{(() => { const pd = panelDe(f.a?.url || f.url); return pd ? <a className="pn-b" href={pd.url} target="_blank" rel="noopener noreferrer">Abrir su panel ↗</a> : null; })()}
                  <a className="pn-b pn-b2" href={f.url || f.a?.url} target="_blank" rel="noopener noreferrer">Abrir el sitio ↗</a>
                  <span className="pn-nota">{panelDe(f.a?.url || f.url)?.directo ? "Entrás directo con tu cuenta (si ya hiciste el paso de dos pasos hoy en este navegador)." : f.id === "fabrica" ? "Fábrica tiene su panel de dueño con su propia clave." : panelDe(f.a?.url || f.url) ? "" : "Esta app no tiene panel propio: todo lo suyo está acá."}</span></p>
              </td></tr>}
            </Fragment>); })}
        </tbody>
      </table>
    </div>
    <Paginas p={p} total={lista.length} por={POR} set={setP} />
  </>);
}

function Ingresos({ pl, cargando }) {
  const [p, setP] = useState(1);
  if (cargando) return <div className="pn-grid4">{Array.from({ length: 8 }, (_, i) => <Kpi key={i} t=" " cargando />)}</div>;
  if (!pl) return null;
  if (pl.error) return <p className="pn-alerta">Cuenta FUNGIRAK: {pl.error}</p>;
  const pagos = pl.pagos || [];
  return (<>
    {!pl.cobro?.activo && <p className="pn-alerta chica">El cobro con Mercado Pago todavía no está activo: por ahora los planes salen de pruebas, regalos y premios.</p>}
    <div className="pn-grid4">
      <Kpi t="Suscripciones activas" v={num(pl.cobro?.activas)} s={pl.cobro?.activas_grupo > 0 ? `${num(pl.cobro.activas_grupo)} de grupo` : ""} />
      <Kpi t="Cobrado · 30 días" v={pesos(pl.cobro?.cobrado30)} s={pl.cobro?.regalos30 > 0 ? `+ ${pesos(pl.cobro.regalos30)} en regalos` : ""} />
      <Kpi t="Cuentas con plan" v={num(pl.con_plan)} />
      <Kpi t="En prueba gratis" v={num(pl.prueba)} />
      <Kpi t="Grupos vigentes" v={num(pl.vigentes)} s={`${num(pl.miembros)} miembros · ${num(pl.grupos)} creados`} />
      <Kpi t="Llegaron invitados" v={num(pl.invitados)} s={`${num(pl.premiados)} con premio`} />
      <Kpi t="Arrepentimientos por resolver" v={num((pl.arrep || []).filter((x) => x.estado === "recibido").length)} tono={(pl.arrep || []).some((x) => x.estado === "recibido") ? "aviso" : ""} />
    </div>
    {pl.motivos?.length > 0 && <p className="pn-nota">Días de plan dados: {pl.motivos.map((m) => `${m.motivo} ${num(m.veces)} veces (${num(m.dias)} días)`).join(" · ")}</p>}
    <section className="pn-card pn-tabla-caja"><h2 className="pn-h-tabla">Últimos pagos</h2>
      <table className="pn-tabla"><thead><tr><th>Fecha</th><th>Cuenta</th><th>Plan</th><th className="n">Monto</th><th>Estado</th></tr></thead>
        <tbody>{!pagos.length ? <tr><td colSpan={5} className="pn-vacio">Todavía no hay pagos.</td></tr> : pagos.slice((p - 1) * 15, p * 15).map((x, i) => <tr key={i}><td>{fecha(x.creado)}</td><td>{x.usuario ? `@${x.usuario}` : "—"}</td><td>{x.plan}{x.periodo ? ` · ${x.periodo}` : ""}{x.personas > 1 ? ` · ${x.personas} personas` : ""}</td><td className="n">{pesos(x.monto)}</td><td><span className={`pn-chip ${x.estado === "aprobado" ? "ok" : ""}`}>{x.estado}</span></td></tr>)}</tbody></table></section>
    <Paginas p={p} total={pagos.length} por={15} set={setP} />
    <p><a className="pn-b pn-b2" href="https://cuenta.fungirak.com/admin" target="_blank" rel="noopener noreferrer">Abrir el panel de la cuenta ↗</a></p>
  </>);
}

function Cuentas({ cu, cargando }) {
  if (cargando) return <div className="pn-grid4">{Array.from({ length: 6 }, (_, i) => <Kpi key={i} t=" " cargando />)}</div>;
  if (!cu) return null;
  if (cu.error) return <p className="pn-alerta">Cuenta FUNGIRAK: {cu.error}</p>;
  const usos = (cu.apps || []).filter((x) => x.personas).sort((a, b) => b.personas - a.personas), max = Math.max(1, usos[0]?.personas || 0);
  return (<>
    <div className="pn-grid4">
      <Kpi t="Cuentas FUNGIRAK" v={num(cu.total)} s={`${num(cu.dia)} hoy · ${num(cu.semana)} en 7 días`} />
      <Kpi t="Activas · 24 h" v={num(cu.activas)} />
      <Kpi t="Con mail confirmado" v={num(cu.con_mail)} s={cu.total ? `${pct(cu.con_mail, cu.total)}% del total` : ""} />
      <Kpi t="Con dos pasos" v={num(cu.dos_pasos)} s={`${num(cu.con_llave)} con llave de acceso`} />
      <Kpi t="De 13 a 17 años" v={num(cu.menores)} />
      <Kpi t="Suspendidas" v={num(cu.suspendidas)} tono={cu.suspendidas > 0 ? "aviso" : ""} />
    </div>
    {usos.length > 0 && <section className="pn-card"><h2>Entran con la cuenta FUNGIRAK</h2>
      {usos.map((x) => <div key={x.nombre} className="pn-rank"><p><span>{x.nombre}</span><b>{num(x.personas)} <small>({num(x.semana)} esta semana)</small></b></p><div><i style={{ width: `${pct(x.personas, max)}%` }} /></div></div>)}</section>}
  </>);
}

function Correo({ c, cargando }) {
  if (cargando) return <div className="pn-grid3">{Array.from({ length: 3 }, (_, i) => <div key={i} className="pn-card"><Sk w="50%" /><Sk h={10} /></div>)}</div>;
  if (!c) return null;
  if (c.error) return <p className="pn-alerta">Correo: {c.error}</p>;
  const u = c.cupo?.usados, tp = c.cupo?.topes, cola = Object.entries(c.cola || {});
  return (<>
    {u && <div className="pn-grid3">
      <Barra t={`Resend${c.cupo.resend ? "" : " (sin cargar)"}`} n={u.resend_dia} de={tp.resend.dia} s={`${num(u.resend_mes)} de ${num(tp.resend.mes)} este mes`} />
      <Barra t={`Gmail${c.cupo.gmail ? "" : " (sin cargar)"}`} n={u.gmail_dia} de={tp.gmail.dia} />
      <Barra t="Marketing" n={u.marketing_dia} de={tp.marketing} s="tope propio, para no quitarle lugar a lo importante" />
    </div>}
    <p className="pn-nota">Direcciones que rebotaron o marcaron spam: <b>{num(c.suprimidos)}</b> · <a href="https://correo.fungirak.com/estado" target="_blank" rel="noopener noreferrer">página de estado ↗</a></p>
    {cola.length > 0 && <section className="pn-card pn-tabla-caja"><h2 className="pn-h-tabla">Envíos por app · 7 días</h2>
      <table className="pn-tabla"><thead><tr><th>App</th><th className="n">Enviados</th><th className="n">Esperando</th><th className="n">Omitidos</th><th className="n">Error</th></tr></thead>
        <tbody>{cola.sort((a, b) => (b[1].enviado || 0) - (a[1].enviado || 0)).map(([s, x]) => <tr key={s}><td>{s}</td><td className="n">{num(x.enviado || 0)}</td><td className="n">{num(x.pendiente || 0)}</td><td className="n">{num(x.omitido || 0)}</td><td className={`n${x.error ? " pn-rojo" : ""}`}>{num(x.error || 0)}</td></tr>)}</tbody></table></section>}
  </>);
}

function Estado({ c, cargando }) {
  if (cargando) return <div className="pn-estado">{Array.from({ length: 12 }, (_, i) => <div key={i} className="pn-card"><Sk w="70%" /></div>)}</div>;
  const l = c?.estado || [];
  if (!l.length) return <p className="pn-nota">{c?.error || "Sin datos de estado."}</p>;
  const mal = l.filter((s) => s.ok === false);
  return (<>
    <p className={mal.length ? "pn-alerta" : "pn-ok-msg"}>{mal.length ? `${mal.length} sitios no responden: ${mal.map((s) => s.nombre).join(", ")}` : `Los ${l.length} sitios están en línea.`}</p>
    <div className="pn-estado">{[...l].sort((a, b) => (a.ok === false) - (b.ok === false) || a.nombre.localeCompare(b.nombre)).reverse().sort((a, b) => (b.ok === false) - (a.ok === false)).map((s) => (
      <div key={s.id} className={`pn-card pn-sitio${s.ok === false ? " mal" : ""}`}><span className="pn-luz" /><b>{s.nombre}</b><small>{s.ms ? `${s.ms} ms` : ""}{s.pct !== null && s.pct !== undefined ? ` · ${s.pct}% en línea` : ""}</small></div>))}</div>
  </>);
}

// Moderación: el muro de fungirak.com (aprobar o borrar) y las apps con contenido para revisar.
function MuroRevision({ llave, filas }) {
  const [l, setL] = useState(null), [err, setErr] = useState("");
  const cargar = useCallback(async () => {
    try { const r = await fetch("/api/panel/muro", { headers: cab(llave), cache: "no-store" }); const j = await r.json(); if (!r.ok) throw new Error(j.error); setL(j.pendientes || []); setErr(""); }
    catch (e) { setErr(e.message || "No se pudo cargar."); }
  }, [llave]);
  useEffect(() => { cargar(); }, [cargar]); // eslint-disable-line react-hooks/set-state-in-effect -- carga al entrar
  const hacer = async (id, accion) => {
    try { const r = await fetch("/api/panel/muro", { method: "POST", headers: cab(llave, { "Content-Type": "application/json" }), body: JSON.stringify({ id, accion }) }); if (!r.ok) throw new Error((await r.json()).error); setL((x) => x.filter((m) => m.id !== id)); }
    catch (e) { setErr(e.message || "No se pudo."); }
  };
  const conPend = filas.filter((f) => f.pend > 0);
  return (<>
    <section className="pn-card"><h2>Muro de fungirak.com <small className="pn-nota">· en revisión: {l ? l.length : "…"}</small></h2>
      {err && <p className="pn-err">{err}</p>}
      {!l && !err && <><Sk /><Sk w="70%" /></>}
      {l && !l.length && <p className="pn-ok-msg">No hay nada esperando revisión.</p>}
      {l && l.length > 0 && <ul className="pn-muro">{l.map((m) => (
        <li key={m.id}><p><b>{m.emoji} {m.nombre || "Anónimo"}</b> <small className="pn-nota">· {m.tipo} · {fecha(m.creado)}{m.reportes ? ` · ${m.reportes} reportes` : ""}</small></p><p>{m.texto}</p>
          <span className="pn-acc"><button type="button" className="pn-b" onClick={() => hacer(m.id, "aprobar")}>Aprobar</button><button type="button" className="pn-b pn-b-peligro" onClick={() => hacer(m.id, "borrar")}>Borrar</button></span></li>))}</ul>}
    </section>
    <section className="pn-card"><h2>Apps con contenido para revisar</h2>
      {!conPend.length ? <p className="pn-ok-msg">Ninguna app tiene denuncias ni contenido oculto pendiente.</p> :
        <ul className="pn-lista">{conPend.map((f) => <li key={f.id}><span>{f.emoji} {f.nombre}</span><em className="pn-cnt">{f.pend}</em><a className="pn-b pn-b2" href={panelDe(f.a.url)?.url || `${f.a.url}/admin`} target="_blank" rel="noopener noreferrer">Revisar ↗</a></li>)}</ul>}
    </section>
  </>);
}

// Auditoría global: la cadena de huellas de cada app y los últimos eventos de todas juntas, con filtros y paginación.
function AuditoriaGlobal({ llave, toast }) {
  const [d, setD] = useState(null), [err, setErr] = useState(""), [cargando, setCargando] = useState(false);
  const [dias, setDias] = useState(7), [app, setApp] = useState(""), [txt, setTxt] = useState(""), [p, setP] = useState(1);
  const cargar = async (dd = dias) => {
    setCargando(true); setErr("");
    try { const r = await fetch(`/api/panel/auditoria?dias=${dd}`, { method: "POST", headers: cab(llave), cache: "no-store" }); const j = await r.json(); if (!r.ok) throw new Error(j.error || "No se pudo."); setD(j); setP(1); }
    catch (e) { setErr(e.message); }
    setCargando(false);
  };
  const nombre = Object.fromEntries((d?.apps || []).map((a) => [a.id, a.nombre]));
  const t = txt.trim().toLowerCase();
  const lista = (d?.eventos || []).filter((e) => (!app || e.app === app) && (!t || `${e.evento} ${e.apodo || ""} ${JSON.stringify(e.detalle || {})}`.toLowerCase().includes(t)));
  const malas = (d?.apps || []).filter((a) => a.cadena && !a.cadena.sana), sinDato = (d?.apps || []).filter((a) => a.error);
  const sanas = (d?.apps || []).filter((a) => a.cadena?.sana).length;
  const POR_A = 25;
  // 20: bloquear la conexión de un evento en esa app (su huella; nunca la IP). Lo aplica el proxy.js de la app.
  const bloquear = async (e) => {
    const a = APPS_PANEL.find((x) => x.id === e.app); if (!a) return;
    const h = new URL(a.url).host;
    const r = await pedir(llave, "cuenta", "/api/admin?que=reglas"); if (!r.ok) return toast(r.d.error || "No se pudo.");
    const act = (r.d.apps || []).find((x) => x.host === h) || { solo_lectura: false, registro_cerrado: false, apagado: {}, huellas: [] };
    if (act.huellas.includes(e.ip)) return toast("Esa conexión ya está bloqueada.");
    const w = await pedir(llave, "cuenta", "/api/admin", "POST", { accion: "reglas", host: h, solo_lectura: act.solo_lectura, registro_cerrado: act.registro_cerrado, apagado: act.apagado, huellas: [...act.huellas, e.ip] });
    toast(w.ok ? `Conexión bloqueada en ${a.nombre}: no puede publicar ni cambiar nada desde ahí.` : w.d.error || "No se pudo.");
  };
  return (<>
    <div className="pn-barra-filtros">
      <div className="pn-seg">{[1, 7, 30, 90, 365].map((n) => <button key={n} type="button" className={dias === n ? "on" : ""} onClick={() => { setDias(n); if (d) cargar(n); }}>{n === 1 ? "24 h" : n === 365 ? "1 año" : `${n} días`}</button>)}</div>
      <button type="button" className="pn-b" onClick={() => cargar()} disabled={cargando}>{cargando ? "Preguntando a cada app…" : d ? "Actualizar" : "Cargar auditoría"}</button>
    </div>
    {err && <p className="pn-alerta">{err}</p>}
    {!d && !cargando && <div className="pn-card pn-vacio-grande"><p><b>La auditoría se carga a pedido.</b></p><p className="pn-nota">Le pregunta a cada app sus últimos eventos y si su cadena de huellas está sana (que nadie cambió ni borró registros). Cada consulta queda registrada.</p></div>}
    {cargando && !d && <div className="pn-grid3">{Array.from({ length: 3 }, (_, i) => <Kpi key={i} t=" " cargando />)}</div>}
    {d && <>
      <div className="pn-grid3">
        <Kpi t="Cadenas sanas" v={`${num(sanas)} / ${num(d.apps.filter((a) => a.cadena).length)}`} tono={malas.length ? "aviso" : "bien"} s={malas.length ? `Con problemas: ${malas.map((a) => a.nombre).join(", ")}` : "Nadie cambió ni borró eventos recientes"} />
        <Kpi t="Eventos" v={num(d.eventos.length)} s={`de ${num(d.apps.length)} apps`} />
        <Kpi t="Apps sin respuesta" v={num(sinDato.length)} tono={sinDato.length ? "aviso" : ""} s={sinDato.slice(0, 4).map((a) => a.nombre).join(", ")} />
      </div>
      <details className="pn-card pn-det"><summary>Estado por app</summary>
        <table className="pn-tabla"><thead><tr><th>App</th><th className="n">Eventos</th><th>Cadena</th></tr></thead>
          <tbody>{d.apps.map((a) => <tr key={a.id}><td>{a.nombre}</td><td className="n">{a.error ? <span className="pn-chip mal" title={a.error}>{/incorrect/i.test(a.error) ? "Sin acceso" : "Sin respuesta"}</span> : num(a.n)}</td>
            <td>{a.cadena ? (a.cadena.sana ? <span className="pn-chip ok">Sana · {num(a.cadena.encadenadas)}</span> : <span className="pn-chip mal">{a.cadena.alteradas} alteradas · {a.cadena.huecos} huecos</span>) : <span className="pn-chip">—</span>}</td></tr>)}</tbody></table>
      </details>
      <div className="pn-barra-filtros">
        <select className="pn-in" value={app} onChange={(e) => { setApp(e.target.value); setP(1); }} aria-label="App"><option value="">Todas las apps</option>{d.apps.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select>
        <input className="pn-in" type="search" value={txt} onChange={(e) => { setTxt(e.target.value); setP(1); }} placeholder="Buscar evento, usuario o detalle" aria-label="Buscar" />
      </div>
      <div className="pn-card pn-tabla-caja">
        <table className="pn-tabla"><thead><tr><th>Cuándo</th><th>App</th><th>Evento</th><th>Quién</th><th className="pn-solo-ancho">Desde</th><th className="pn-solo-ancho">Detalle</th></tr></thead>
          <tbody>{!lista.length ? <tr><td colSpan={6} className="pn-vacio">No hay eventos con ese filtro.</td></tr> : lista.slice((p - 1) * POR_A, p * POR_A).map((e) => <tr key={`${e.app}-${e.id}`}>
            <td className="pn-nw">{fechaHora(e.creado)}</td><td>{nombre[e.app] || e.app}</td><td><code className="pn-ev">{e.evento}</code></td>
            <td>{e.apodo ? `@${e.apodo}` : "—"}</td><td className="pn-solo-ancho">{[e.dispositivo, e.region || e.pais].filter(Boolean).join(" · ") || "—"}</td>
            <td className="pn-solo-ancho"><code className="pn-det-cod">{JSON.stringify(e.detalle || {}).slice(0, 90)}</code>{/^[a-f0-9]{24}$/.test(e.ip || "") && APPS_PANEL.some((x) => x.id === e.app) && <button type="button" className="pn-link" style={{ display: "block", marginTop: 4 }} onClick={() => bloquear(e)}>Bloquear esta conexión</button>}</td></tr>)}</tbody></table>
      </div>
      <Paginas p={p} total={lista.length} por={POR_A} set={setP} />
      <p className="pn-nota">Generado {fechaHora(d.generado)}. Las IP nunca se guardan: solo una huella.</p>
    </>}
  </>);
}

const CSS = `
.pn{--f:#f6f7f9;--c:#fff;--t:#0f1419;--s:#5b6472;--l:#e5e8ee;--ac:#0b7a55;--ac2:#e3f4ec;--az:#2563eb;--r:#c4271b;--r2:#fdecea;--am:#b45309;--am2:#fef3e2;--sk1:#eceff3;--sk2:#f7f8fa;
  min-height:100vh;background:var(--f);color:var(--t);font:14.5px/1.5 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
@media (prefers-color-scheme:dark){.pn{--f:#0b0e13;--c:#141921;--t:#e8ecf2;--s:#94a0b2;--l:#232b37;--ac:#3ecf8e;--ac2:#12261d;--az:#60a5fa;--r:#ff7b6e;--r2:#2b1513;--am:#fbbf24;--am2:#2a2012;--sk1:#1b222c;--sk2:#232c38}}
:root[data-tema="claro"] .pn{--f:#f6f7f9;--c:#fff;--t:#0f1419;--s:#5b6472;--l:#e5e8ee;--ac:#0b7a55;--ac2:#e3f4ec;--az:#2563eb;--r:#c4271b;--r2:#fdecea;--am:#b45309;--am2:#fef3e2;--sk1:#eceff3;--sk2:#f7f8fa}
:root[data-tema="oscuro"] .pn{--f:#0b0e13;--c:#141921;--t:#e8ecf2;--s:#94a0b2;--l:#232b37;--ac:#3ecf8e;--ac2:#12261d;--az:#60a5fa;--r:#ff7b6e;--r2:#2b1513;--am:#fbbf24;--am2:#2a2012;--sk1:#1b222c;--sk2:#232c38}
.pn *{box-sizing:border-box}
.pn-progreso{position:fixed;left:0;right:0;top:0;height:3px;z-index:50;opacity:0;transition:opacity .4s .3s;pointer-events:none}.pn-progreso.on{opacity:1;transition-delay:0s}
.pn-progreso i{display:block;height:100%;background:linear-gradient(90deg,#00a957,#1690a8 55%,#7346e8);border-radius:0 3px 3px 0;transition:width .5s ease;box-shadow:0 0 10px rgba(22,144,168,.6)}
.pn-app{display:grid;grid-template-columns:232px minmax(0,1fr)}
.pn-side{position:sticky;top:0;height:100vh;padding:18px 12px;border-right:1px solid var(--l);background:var(--c);display:flex;flex-direction:column;gap:14px}
.pn-logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:16px;padding:4px 10px 10px;letter-spacing:-.01em}
.pn-dot{width:12px;height:12px;border-radius:4px;background:linear-gradient(135deg,#00a957,#1690a8 55%,#7346e8)}
.pn-side nav{display:grid;gap:2px}
.pn-side nav button,.pn-salir{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;border:0;background:none;color:var(--s);font:600 14px/1 inherit;font-family:inherit;cursor:pointer;text-align:left}
.pn-side nav button:hover{background:var(--f);color:var(--t)}.pn-side nav button.on{background:var(--ac2);color:var(--ac)}
.pn-salir{margin-top:auto}.pn-salir:hover{color:var(--r)}
.pn-cnt{margin-left:auto;font-style:normal;font-size:11px;font-weight:800;min-width:20px;padding:2px 7px;border-radius:99px;background:var(--r);color:#fff;text-align:center}
.pn-main{padding:24px clamp(16px,3vw,36px) 100px;min-width:0;display:grid;gap:18px;align-content:start;max-width:1280px}
.pn-top{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap}
.pn-top h1{margin:0;font-size:26px;letter-spacing:-.02em}.pn-sub{margin:2px 0 0;color:var(--s);font-size:13px}
.pn-vivo::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ac);margin-right:6px;animation:pn-lat 1s infinite alternate}
@keyframes pn-lat{to{opacity:.25}}
.pn-acc{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0}
.pn-b{display:inline-flex;align-items:center;gap:6px;padding:9px 15px;border-radius:10px;border:1px solid transparent;background:var(--ac);color:#fff;font:700 13.5px/1 inherit;font-family:inherit;cursor:pointer;text-decoration:none;white-space:nowrap}
.pn-b:disabled{opacity:.55;cursor:default}.pn-b2{background:var(--c);color:var(--t);border-color:var(--l)}.pn-b2:hover:not(:disabled){border-color:var(--s)}
.pn-b-peligro{background:transparent;color:var(--r);border-color:var(--r)}
@media (prefers-color-scheme:dark){.pn-b:not(.pn-b2):not(.pn-b-peligro){color:#06120c}}
.pn-link{background:none;border:0;color:var(--az);font:600 13.5px inherit;font-family:inherit;cursor:pointer;padding:0;margin-top:10px}
.pn-card{background:var(--c);border:1px solid var(--l);border-radius:14px;padding:16px;min-width:0}
.pn-card h2{margin:0 0 12px;font-size:15px;letter-spacing:-.01em}
.pn-grid4{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}.pn-grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
.pn-dos{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:12px}@media (max-width:900px){.pn-dos{grid-template-columns:1fr}}
.pn-kpi{display:grid;gap:6px;align-content:start}.pn-kt{color:var(--s);font-size:12.5px;font-weight:600}
.pn-kpi b{font-size:28px;line-height:1.1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.pn-kpi small{color:var(--s);font-size:12px}
.pn-kpi.aviso{border-color:color-mix(in srgb,var(--am) 45%,var(--l));background:linear-gradient(var(--am2),var(--c))}.pn-kpi.bien b{color:var(--ac)}
.pn-sk{display:block;background:linear-gradient(90deg,var(--sk1) 25%,var(--sk2) 50%,var(--sk1) 75%);background-size:200% 100%;animation:pn-sk 1.2s linear infinite;margin:4px 0}
@keyframes pn-sk{to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){.pn-sk,.pn-vivo::before{animation:none}}
.pn-rank{margin-bottom:10px}.pn-rank p{display:flex;justify-content:space-between;gap:8px;margin:0 0 4px;font-size:13.5px}.pn-rank b{font-variant-numeric:tabular-nums}.pn-rank small{color:var(--s);font-weight:500}
.pn-rank div,.pn-barra div,.pn-mini-barra div{height:8px;border-radius:99px;background:var(--f);overflow:hidden}.pn-rank i,.pn-barra i,.pn-mini-barra i{display:block;height:100%;border-radius:99px;background:var(--ac)}
.pn-barra i.alto{background:var(--r)}.pn-barra p{display:flex;justify-content:space-between;margin:0 0 8px}.pn-barra p span,.pn-barra small{color:var(--s);font-size:12.5px}.pn-barra small{display:block;margin-top:6px}
.pn-mini-barra{display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center;font-size:13px;margin-bottom:8px}.pn-mini-barra span{color:var(--s)}
.pn-salud{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.pn-salud li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--f);cursor:pointer;font-weight:600;font-size:13.5px}
.pn-salud li::before{content:"";width:9px;height:9px;border-radius:50%;flex:none;background:var(--s)}.pn-salud li.ok::before{background:var(--ac)}.pn-salud li.mal::before{background:var(--r)}.pn-salud li.mal{color:var(--r)}
.pn-barra-filtros{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.pn-in{padding:9px 12px;border-radius:10px;border:1px solid var(--l);background:var(--c);color:var(--t);font:inherit;min-width:0}
input.pn-in{flex:1 1 220px}.pn-in:focus{outline:2px solid color-mix(in srgb,var(--ac) 50%,transparent);outline-offset:1px}
.pn-orden{display:flex;align-items:center;gap:8px;color:var(--s);font-size:13px;font-weight:600}
.pn-seg{display:inline-flex;padding:3px;border-radius:11px;background:var(--c);border:1px solid var(--l);gap:2px;overflow-x:auto;max-width:100%}
.pn-seg button{border:0;background:none;color:var(--s);padding:6px 11px;border-radius:8px;font:600 13px inherit;font-family:inherit;cursor:pointer;white-space:nowrap}.pn-seg button.on{background:var(--t);color:var(--c)}
.pn-tabla-caja{padding:0;overflow:auto}.pn-h-tabla{padding:14px 16px 0}
.pn-tabla{width:100%;border-collapse:collapse;font-size:13.5px}
.pn-tabla th{position:sticky;top:0;background:var(--c);text-align:left;font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--s);font-weight:700;padding:11px 14px;border-bottom:1px solid var(--l);white-space:nowrap}
.pn-tabla td{padding:11px 14px;border-bottom:1px solid var(--l);vertical-align:middle}.pn-tabla tbody tr:last-child td{border-bottom:0}
.pn-tabla .n{text-align:right;font-variant-numeric:tabular-nums}.pn-fila{cursor:pointer}.pn-fila:hover td,.pn-fila.ab td{background:var(--f)}
.pn-app-n{display:flex;align-items:center;gap:10px}.pn-app-n b{display:block}.pn-app-n small{display:flex;gap:6px;align-items:center;color:var(--s);font-size:12px}.pn-app-n .pn-cnt{margin-left:0;font-size:10.5px;white-space:nowrap}
.pn-em{width:34px;height:34px;border-radius:10px;background:var(--f);display:grid;place-items:center;font-size:18px;flex:none}
.pn-flecha{color:var(--s);width:24px}.pn-nw{white-space:nowrap}
.pn-detalle td{background:var(--f);padding:14px 16px 18px}
.pn-metricas{list-style:none;padding:0;margin:0 0 12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:4px 18px}
.pn-metricas li{display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px dashed var(--l);font-size:13px}.pn-metricas span{color:var(--s)}.pn-metricas b{text-align:right;overflow-wrap:anywhere}
.pn-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:99px;background:var(--f);color:var(--s);font-size:12px;font-weight:700;white-space:nowrap;border:1px solid var(--l)}
.pn-chip::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.pn-chip.ok{background:var(--ac2);color:var(--ac);border-color:transparent}.pn-chip.mal{background:var(--r2);color:var(--r);border-color:transparent;cursor:help}
.pn-spark{width:110px;height:32px;display:block}.pn-spark .l{fill:none;stroke:var(--ac);stroke-width:2;vector-effect:non-scaling-stroke}.pn-spark .a{fill:var(--ac2);stroke:none}
.pn-spark-vacio{display:block;width:110px;height:2px;background:var(--l);border-radius:2px}
.pn-pag{display:flex;align-items:center;justify-content:flex-end;gap:10px;color:var(--s);font-size:13px}.pn-pag .pn-b{padding:7px 12px}
.pn-alerta{margin:0;padding:11px 14px;border-radius:12px;background:var(--am2);color:var(--am);font-weight:600;font-size:13.5px;border:1px solid color-mix(in srgb,var(--am) 30%,transparent)}
.pn-alerta.chica{font-size:13px;font-weight:500}.pn-ok-msg{margin:0;padding:11px 14px;border-radius:12px;background:var(--ac2);color:var(--ac);font-weight:600;font-size:13.5px}
.pn-err,.pn-rojo{color:var(--r);font-weight:600}.pn-nota{color:var(--s);font-size:13px;margin:0}.pn-vacio{text-align:center;color:var(--s);padding:28px!important}
.pn-vacio-grande{text-align:center;padding:36px 20px}.pn-vacio-grande p{margin:0 0 6px}
.pn-estado{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.pn-sitio{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;align-items:center;padding:12px 14px}.pn-sitio small{grid-column:2;color:var(--s);font-size:12px}
.pn-luz{width:10px;height:10px;border-radius:50%;background:var(--ac);box-shadow:0 0 0 4px var(--ac2)}.pn-sitio.mal{border-color:var(--r)}.pn-sitio.mal .pn-luz{background:var(--r);box-shadow:0 0 0 4px var(--r2)}
.pn-muro,.pn-lista{list-style:none;padding:0;margin:0;display:grid;gap:10px}.pn-muro li{border:1px solid var(--l);border-radius:12px;padding:12px;display:grid;gap:6px}.pn-muro p{margin:0;overflow-wrap:anywhere}
.pn-lista li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--f)}.pn-lista .pn-cnt{margin-left:auto}
.pn-det summary{cursor:pointer;font-weight:700}.pn-det[open] summary{margin-bottom:12px}
.pn-ev{font:600 12px ui-monospace,SFMono-Regular,Menlo,monospace;padding:2px 7px;border-radius:6px;background:var(--f);border:1px solid var(--l)}
.pn-det-cod{font:12px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--s);word-break:break-all}
.pn-tabs{display:none}.pn-movil{display:none}
.pn-acceso{display:grid;place-items:center;padding:20px}
.pn-login{width:min(360px,100%);display:grid;gap:14px;padding:26px}.pn-login h1{margin:0;font-size:20px}
.pn-login label{display:grid;gap:6px;font-weight:600;font-size:13.5px}.pn-login input{padding:11px 12px;border-radius:10px;border:1px solid var(--l);background:var(--f);color:var(--t);font:inherit}
.pn-login .pn-b{justify-content:center;padding:11px}
.pn-otra summary{cursor:pointer;color:var(--s);font-size:13px}.pn-otra form{display:grid;gap:10px;margin-top:10px}
@media (max-width:860px){
  .pn-app{grid-template-columns:1fr}.pn-side{display:none}.pn-movil{display:inline-flex}
  .pn-main{padding:18px 14px 96px}
  .pn-tabs{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:20;background:var(--c);border-top:1px solid var(--l);overflow-x:auto;padding:6px 6px calc(6px + env(safe-area-inset-bottom))}
  .pn-tabs button{flex:1 0 70px;display:grid;justify-items:center;gap:3px;border:0;background:none;color:var(--s);font:600 11px inherit;font-family:inherit;padding:6px 4px;border-radius:10px;cursor:pointer}
  .pn-tabs button.on{color:var(--ac);background:var(--ac2)}
  .pn-solo-ancho{display:none}
  .pn-tabla td,.pn-tabla th{padding:10px}
}
`;
