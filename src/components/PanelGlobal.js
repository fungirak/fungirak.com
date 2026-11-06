"use client";
// Panel global del estudio: suscripciones y planes de la cuenta FUNGIRAK, el correo central (cupo de mails de hoy, cola y estado
// de los sitios) y TODAS las apps, juegos y sitios por categoría: los números en vivo de las que tienen panel y, en cada una, todas
// sus métricas del mail diario. La contraseña maestra queda solo en esta pestaña.
import { useCallback, useEffect, useState } from "react";

const K = "panel.llave";
const num = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString("es-AR"));
const pct = (a, b) => (b ? Math.min(100, Math.round((a / b) * 100)) : 0);
const pesos = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }));
const fecha = (f) => (f ? new Date(f).toLocaleDateString("es-AR", { day: "numeric", month: "short" }) : "—");
const host = (u) => String(u || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const valor = (m, k) => Number.parseFloat(m.find(([x]) => x === k)?.[1]) || 0;

export default function Panel() {
  const [llave, setLlave] = useState("");
  const [d, setD] = useState(null), [error, setError] = useState(""), [cargando, setCargando] = useState(false);
  useEffect(() => { try { setLlave(sessionStorage.getItem(K) || ""); } catch {} }, []); // eslint-disable-line react-hooks/set-state-in-effect -- la llave de esta pestaña
  const cargar = useCallback(async (k) => {
    setCargando(true); setError("");
    try {
      const r = await fetch("/api/panel", { method: "POST", headers: { "x-admin-key": k }, cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setError(j.error || "No se pudo."); if (r.status === 401) { setLlave(""); try { sessionStorage.removeItem(K); } catch {} } setD(null); }
      else setD(j);
    } catch { setError("Sin conexión."); }
    setCargando(false);
  }, []);
  useEffect(() => { if (llave) cargar(llave); }, [llave, cargar]); // eslint-disable-line react-hooks/set-state-in-effect -- carga al entrar
  const entrar = (e) => { e.preventDefault(); const v = String(new FormData(e.currentTarget).get("k") || ""); try { sessionStorage.setItem(K, v); } catch {} setLlave(v); };

  const apps = d?.apps || [];
  const todas = d?.todas?.apps || [], grupos = d?.todas?.grupos || [];
  // cuentas y nuevas: con las métricas de todas se suman también las que no tienen panel (Team Joy, Dertin, Dami…); si no, las del panel
  const tot = (k) => (todas.length && (k === "cuentas" || k === "nuevas7")
    ? todas.reduce((t, a) => t + valor(a.metricas, k === "cuentas" ? "Cuentas en total" : "Cuentas nuevas (7 días)"), 0)
    : apps.reduce((t, a) => t + (Number(a[k]) || 0), 0));
  const enVivo = Object.fromEntries(apps.map((a) => [host(a.url), a]));
  const sueltas = apps.filter((a) => !todas.some((t) => host(t.url) === host(a.url)));
  const pl = d?.planes, cu = d?.cuenta;
  const c = d?.correo, u = c?.cupo?.usados, tp = c?.cupo?.topes;
  return (
    <div className="adm">
      <style>{CSS}</style>
      <header className="adm-cab"><div><p className="adm-ojo">FUNGIRAK Studio</p><h1>Panel global</h1></div>
        {llave && <span className="adm-acc"><button type="button" className="adm-b adm-b2" onClick={() => cargar(llave)} disabled={cargando}>{cargando ? "Actualizando…" : "↻ Actualizar"}</button>
          <button type="button" className="adm-b adm-b2" onClick={() => { try { sessionStorage.removeItem(K); } catch {} setLlave(""); setD(null); }}>Salir</button></span>}</header>
      {!llave ? (
        <form className="adm-entrar" onSubmit={entrar}>
          <label>Contraseña maestra<input name="k" type="password" autoComplete="current-password" required minLength={16} /></label>
          <button className="adm-b">Entrar</button>
          {error && <p className="adm-err" role="alert">{error}</p>}
        </form>
      ) : !d ? <p className="adm-vacio">{error || "Cargando todas las apps…"}</p> : (
        <>
          <div className="adm-tiles">
            <div className="adm-tile"><b>{num(tot("cuentas"))}</b><span>cuentas en todas las apps</span></div>
            <div className="adm-tile"><b>{num(tot("nuevas7"))}</b><span>cuentas nuevas esta semana</span></div>
            <div className="adm-tile"><b>{num(tot("activas7"))}</b><span>personas activas esta semana</span></div>
            <div className="adm-tile"><b>{num(tot("pendientes"))}</b><span>denuncias para revisar</span></div>
          </div>

          <h2>💳 Suscripciones y planes</h2>
          {pl?.error ? <p className="adm-err">Cuenta FUNGIRAK: {pl.error}</p> : pl && <>
            {!pl.cobro?.activo && <p className="adm-nota">El cobro con Mercado Pago todavía no está activo: por ahora los planes salen de pruebas, regalos y premios.</p>}
            <div className="adm-tiles chicas">
              <div className="adm-tile"><b>{num(pl.cobro?.activas)}</b><span>suscripciones activas</span>{pl.cobro?.activas_grupo > 0 && <small>{num(pl.cobro.activas_grupo)} de grupo</small>}</div>
              <div className="adm-tile"><b>{pesos(pl.cobro?.cobrado30)}</b><span>cobrado en 30 días</span>{pl.cobro?.regalos30 > 0 && <small>+ {pesos(pl.cobro.regalos30)} en regalos</small>}</div>
              <div className="adm-tile"><b>{num(pl.con_plan)}</b><span>cuentas con plan</span></div>
              <div className="adm-tile"><b>{num(pl.prueba)}</b><span>en prueba gratis</span></div>
              <div className="adm-tile"><b>{num(pl.vigentes)}</b><span>grupos vigentes</span><small>{num(pl.miembros)} miembros · {num(pl.grupos)} creados</small></div>
              <div className="adm-tile"><b>{num(pl.invitados)}</b><span>llegaron invitados</span><small>{num(pl.premiados)} con premio</small></div>
              <div className="adm-tile"><b>{num((pl.arrep || []).filter((x) => x.estado === "recibido").length)}</b><span>arrepentimientos por resolver</span></div>
            </div>
            {pl.motivos?.length > 0 && <p className="adm-nota">Días de plan dados: {pl.motivos.map((m) => `${m.motivo} ${num(m.veces)} veces (${num(m.dias)} días)`).join(" · ")}</p>}
            {pl.pagos?.length > 0 && <table className="adm-tabla"><thead><tr><th>Fecha</th><th>Cuenta</th><th>Plan</th><th>Monto</th><th>Estado</th></tr></thead>
              <tbody>{pl.pagos.slice(0, 12).map((p, i) => <tr key={i}><td>{fecha(p.creado)}</td><td>{p.usuario ? `@${p.usuario}` : "—"}</td><td>{p.plan}{p.periodo ? ` · ${p.periodo}` : ""}{p.personas > 1 ? ` · ${p.personas} personas` : ""}</td><td>{pesos(p.monto)}</td><td>{p.estado}</td></tr>)}</tbody></table>}
            <p style={{ margin: "8px 0 0" }}><a className="adm-b adm-b2" style={{ textDecoration: "none" }} href="https://cuenta.fungirak.com/admin" target="_blank" rel="noopener noreferrer">Abrir el panel de la cuenta →</a></p>
          </>}

          <h2>🔑 Cuenta FUNGIRAK</h2>
          {cu?.error ? <p className="adm-err">Cuenta FUNGIRAK: {cu.error}</p> : cu && <>
            <div className="adm-tiles chicas">
              <div className="adm-tile"><b>{num(cu.total)}</b><span>cuentas</span><small>{num(cu.dia)} hoy · {num(cu.semana)} en 7 días</small></div>
              <div className="adm-tile"><b>{num(cu.activas)}</b><span>activas en 24 h</span></div>
              <div className="adm-tile"><b>{num(cu.con_mail)}</b><span>con mail confirmado</span></div>
              <div className="adm-tile"><b>{num(cu.dos_pasos)}</b><span>con dos pasos</span><small>{num(cu.con_llave)} con llave de acceso</small></div>
              <div className="adm-tile"><b>{num(cu.menores)}</b><span>de 13 a 17 años</span></div>
              <div className="adm-tile"><b>{num(cu.suspendidas)}</b><span>suspendidas</span></div>
            </div>
            {cu.apps?.some((x) => x.personas) && <p className="adm-nota">Entran con la cuenta: {cu.apps.filter((x) => x.personas).sort((a, b) => b.personas - a.personas).map((x) => `${x.nombre} ${num(x.personas)} (${num(x.semana)} esta semana)`).join(" · ")}</p>}
          </>}

          <h2>✉️ Mails de hoy</h2>
          {c?.error ? <p className="adm-err">Correo: {c.error}</p> : u && (
            <div className="pg-correo">
              <Barra t={`Resend${c.cupo.resend ? "" : " (sin cargar)"}`} n={u.resend_dia} de={tp.resend.dia} s={`${num(u.resend_mes)} de ${num(tp.resend.mes)} este mes`} />
              <Barra t={`Gmail${c.cupo.gmail ? "" : " (sin cargar: corré gmail-al-correo.sh)"}`} n={u.gmail_dia} de={tp.gmail.dia} />
              <Barra t="Marketing" n={u.marketing_dia} de={tp.marketing} s="tope propio, para no quitarle lugar a lo importante" />
              <p className="adm-nota">Direcciones que rebotaron o marcaron spam: <b>{num(c.suprimidos)}</b> · <a href="https://correo.fungirak.com/estado" target="_blank" rel="noopener noreferrer">página de estado</a></p>
              {Object.keys(c.cola || {}).length > 0 && <table className="adm-tabla"><thead><tr><th>App (7 días)</th><th>Enviados</th><th>Esperando</th><th>Omitidos</th><th>Error</th></tr></thead>
                <tbody>{Object.entries(c.cola).map(([s, x]) => <tr key={s}><td>{s}</td><td>{num(x.enviado || 0)}</td><td>{num(x.pendiente || 0)}</td><td>{num(x.omitido || 0)}</td><td>{num(x.error || 0)}</td></tr>)}</tbody></table>}
            </div>)}

          {d.todas?.error && <p className="adm-err">Las métricas de todas las apps no llegaron ({d.todas.error}): abajo van solo las que tienen panel.</p>}
          {grupos.map((g) => { const del = todas.filter((a) => a.grupo === g); return del.length > 0 && <section key={g}>
            <h2>{{ Apps: "📱", Juegos: "🎮", Sitios: "🌐" }[g] || "📁"} {g} <small className="adm-nota">· {del.length}</small></h2>
            <div className="pg-apps">{del.map((t) => <App key={t.id} t={t} a={enVivo[host(t.url)]} />)}</div>
          </section>; })}
          {sueltas.length > 0 && <><h2>📱 {todas.length ? "Otras con panel" : "Las apps"}</h2><div className="pg-apps">{sueltas.map((a) => <App key={a.id} a={a} />)}</div></>}

          {c?.estado?.length > 0 && <><h2>🟢 Estado de los sitios</h2>
            <ul className="pg-estado">{c.estado.map((s) => <li key={s.id} className={s.ok === false ? "pg-mal" : ""}>{s.ok === false ? "🔴" : "🟢"} {s.nombre}<small>{s.ms ? `${s.ms} ms` : ""}{s.pct !== null && s.pct !== undefined ? ` · ${s.pct}%` : ""}</small></li>)}</ul></>}
          <p className="adm-nota">Actualizado {new Date(d.generado).toLocaleString("es-AR")}. Team Joy, Dertin y Dami Laoshi tienen además su propio reporte por mail.</p>
        </>
      )}
    </div>
  );
}
// Una app: arriba sus números en vivo (si tiene panel) y abajo, desplegables, todas sus métricas del mail diario.
function App({ t, a }) {
  const m = t?.metricas || [], url = a?.url || t?.url;
  return (
    <article className={`adm-tile pg-app${a && !a.ok ? " pg-mal" : ""}`}>
      <p className="pg-n">{t?.emoji || a?.emoji} <b>{t?.nombre || a?.nombre}</b>{a?.pendientes > 0 && <span className="pg-badge">{a.pendientes} para revisar</span>}</p>
      {a && (a.ok ? <>
        <dl><div><dt>cuentas</dt><dd>{num(a.cuentas)}</dd></div><div><dt>nuevas 7 días</dt><dd>{num(a.nuevas7 ?? a.nuevasHoy)}</dd></div><div><dt>activas 7 días</dt><dd>{num(a.activas7)}</dd></div></dl>
        {a.nota && <p className="pg-nota" style={{ margin: 0, fontSize: ".8rem", opacity: .8 }}>{a.nota}</p>}
        {a.dias?.length > 0 && <Mini dias={a.dias} />}
      </> : <p className="adm-err">{a.codigo === 404 ? "Panel todavía sin publicar" : a.error}</p>)}
      {!a && m.length > 0 && <ul className="pg-filas">{m.slice(0, 3).map(([k, v]) => <li key={k}><span>{k}</span><b>{String(v)}</b></li>)}</ul>}
      {t?.error && <p className="adm-err">{t.error}</p>}
      {m.length > (a ? 0 : 3) && <details className="pg-mas"><summary>Todas sus métricas ({m.length})</summary><ul className="pg-filas">{m.map(([k, v]) => <li key={k}><span>{k}</span><b>{String(v)}</b></li>)}</ul></details>}
      <a className="adm-b adm-b2" href={a ? `${url}/admin` : url} target="_blank" rel="noopener noreferrer">{a ? "Abrir su panel →" : "Abrir el sitio →"}</a>
    </article>
  );
}
function Barra({ t, n, de, s }) {
  const p = pct(n, de);
  return <div className="pg-barra"><p><b>{t}</b> <span>{num(n)} de {num(de)}</span></p><div><i style={{ width: `${p}%`, background: p > 85 ? "var(--a-r)" : "var(--a-ac)" }} /></div>{s && <small>{s}</small>}</div>;
}
function Mini({ dias }) {
  const max = Math.max(1, ...dias.map((x) => (x.cuentas || 0) + (x.publicaciones || 0)));
  return <div className="pg-mini" aria-hidden="true">{dias.map((x) => <span key={x.dia} style={{ height: `${Math.max(4, (((x.cuentas || 0) + (x.publicaciones || 0)) / max) * 100)}%` }} title={x.dia} />)}</div>;
}

const CSS = `
.adm{--a-f:#f5f5f2;--a-c:#fff;--a-t:#1d1d1f;--a-s:#6b6b72;--a-l:#e6e4dd;--a-ac:#2f6b4f;--a-ac2:#e7f2ec;--a-r:#b42318;max-width:76rem;margin:0 auto;padding:20px 16px 90px;color:var(--a-t);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
@media (prefers-color-scheme:dark){.adm{--a-f:#141518;--a-c:#1c1e22;--a-t:#ececee;--a-s:#a3a6ad;--a-l:#2d3036;--a-ac:#7fd1a6;--a-ac2:#1e2b25;--a-r:#ff8a80}}
:root[data-tema="claro"] .adm{--a-f:#f5f5f2;--a-c:#fff;--a-t:#1d1d1f;--a-s:#6b6b72;--a-l:#e6e4dd;--a-ac:#2f6b4f;--a-ac2:#e7f2ec;--a-r:#b42318}
:root[data-tema="oscuro"] .adm{--a-f:#141518;--a-c:#1c1e22;--a-t:#ececee;--a-s:#a3a6ad;--a-l:#2d3036;--a-ac:#7fd1a6;--a-ac2:#1e2b25;--a-r:#ff8a80}
.adm h1{font-size:28px;margin:0}.adm h2{font-size:18px;margin:26px 0 10px}
.adm-cab{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.adm-ojo{margin:0;color:var(--a-s);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.adm-entrar{max-width:420px;background:var(--a-c);border:1px solid var(--a-l);border-radius:16px;padding:18px;display:grid;gap:12px}
.adm-entrar label{display:grid;gap:6px;font-weight:600}.adm-entrar input,.adm-in{padding:10px 12px;border-radius:10px;border:1px solid var(--a-l);background:var(--a-f);color:var(--a-t);font:inherit;width:100%}
.adm-b{padding:8px 14px;border-radius:999px;border:0;background:var(--a-ac);color:#fff;font:inherit;font-weight:700;cursor:pointer}
@media (prefers-color-scheme:dark){.adm-b{color:#0e1a14}}.adm-b2{background:var(--a-ac2);color:var(--a-ac)}.adm-peligro{background:transparent;color:var(--a-r);border:1px solid var(--a-r)}
.adm-tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:8px}.adm-tabs button{white-space:nowrap;padding:8px 14px;border-radius:999px;border:1px solid var(--a-l);background:var(--a-c);color:var(--a-t);font:inherit;font-weight:600;cursor:pointer}
.adm-tabs button.on{background:var(--a-ac);border-color:var(--a-ac);color:#fff}
.adm-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}.adm-tiles.chicas{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.adm-tile{background:var(--a-c);border:1px solid var(--a-l);border-radius:14px;padding:14px;display:grid;gap:2px}.adm-tile b{font-size:26px;line-height:1.1}.adm-tile span{color:var(--a-s);font-size:13px}.adm-tile small{color:var(--a-s);font-size:12px}
.adm-tiles.chicas .adm-tile b{font-size:20px}
.adm-graf{display:flex;align-items:flex-end;gap:6px;height:160px;background:var(--a-c);border:1px solid var(--a-l);border-radius:14px;padding:12px 12px 22px}
.adm-graf div{flex:1;height:100%;display:flex;align-items:flex-end;justify-content:center;gap:2px;position:relative}.adm-graf span{width:40%;border-radius:4px 4px 0 0;min-height:2px}
.adm-graf small{position:absolute;bottom:-18px;font-size:11px;color:var(--a-s)}.adm-graf .c,.adm-ley .c{background:var(--a-ac)}.adm-graf .p,.adm-ley .p{background:#c58b2c}
.adm-ley{font-size:13px;color:var(--a-s);display:flex;gap:8px;align-items:center}.adm-ley i{display:inline-block;width:10px;height:10px;border-radius:3px}
.adm-lista,.adm-personas,.adm-simple{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.adm-lista li{display:flex;gap:12px;background:var(--a-c);border:1px solid var(--a-l);border-radius:14px;padding:12px}.adm-lista li.oculto{border-color:var(--a-r)}.adm-lista img{border-radius:10px;object-fit:cover}
.adm-lista p{margin:0 0 6px}.adm-meta{color:var(--a-s);font-size:13px}.adm-acc{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.adm-acc a{color:var(--a-ac);font-weight:600}
.adm-dos{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:16px}@media (max-width:760px){.adm-dos{grid-template-columns:1fr}}
.adm-personas{margin-top:10px}.adm-personas button{width:100%;text-align:left;background:var(--a-c);border:1px solid var(--a-l);border-radius:12px;padding:10px;color:var(--a-t);font:inherit;cursor:pointer;display:grid}
.adm-personas button.on{border-color:var(--a-ac)}.adm-personas small{color:var(--a-s);font-size:12px}
.adm-ficha{background:var(--a-c);border:1px solid var(--a-l);border-radius:16px;padding:16px}.adm-ficha h2{margin-top:0}
.adm-ficha dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin:0 0 14px}.adm-ficha dt{font-size:12px;color:var(--a-s)}.adm-ficha dd{margin:0;font-weight:600;overflow-wrap:anywhere}
.adm-tabla{width:100%;border-collapse:collapse;background:var(--a-c);border:1px solid var(--a-l);border-radius:12px;overflow:hidden;font-size:14px}.adm-tabla th,.adm-tabla td{padding:8px 10px;border-bottom:1px solid var(--a-l);text-align:left}.adm-tabla th{color:var(--a-s);font-weight:600}
.adm-err{color:var(--a-r);font-weight:600}.adm-ok{color:var(--a-ac);font-weight:600}.adm-vacio,.adm-nota{color:var(--a-s)}
.adm-aud{background:var(--a-c);border:1px solid var(--a-l);border-radius:16px;padding:12px;overflow-x:auto}

.pg-correo{display:grid;gap:10px}.pg-barra{background:var(--a-c);border:1px solid var(--a-l);border-radius:14px;padding:12px}
.pg-barra p{margin:0 0 6px;display:flex;justify-content:space-between;gap:8px}.pg-barra p span{color:var(--a-s)}.pg-barra div{height:10px;border-radius:99px;background:var(--a-ac2);overflow:hidden}
.pg-barra i{display:block;height:100%;border-radius:99px}.pg-barra small{color:var(--a-s);font-size:12px}
.pg-apps{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}.pg-app{gap:10px}.pg-app.pg-mal{border-color:var(--a-r)}
.pg-n{margin:0;display:flex;gap:6px;align-items:center;flex-wrap:wrap}.pg-badge{margin-left:auto;font-size:12px;font-weight:700;padding:2px 8px;border-radius:99px;background:var(--a-r);color:#fff}
.pg-app dl{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0}.pg-app dt{font-size:11px;color:var(--a-s)}.pg-app dd{margin:0;font-weight:800;font-size:18px}
.pg-app .adm-b{text-align:center;text-decoration:none}.pg-mini{display:flex;align-items:flex-end;gap:2px;height:34px}.pg-mini span{flex:1;background:var(--a-ac);border-radius:2px;opacity:.75}
.pg-filas{list-style:none;padding:0;margin:0;display:grid;gap:2px;font-size:13px}.pg-filas li{display:flex;justify-content:space-between;gap:10px;border-top:1px solid var(--a-l);padding:3px 0}
.pg-filas span{color:var(--a-s)}.pg-filas b{text-align:right;overflow-wrap:anywhere}.pg-mas summary{cursor:pointer;color:var(--a-ac);font-weight:600;font-size:13px}.pg-mas[open] summary{margin-bottom:6px}
.pg-estado{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px}
.pg-estado li{background:var(--a-c);border:1px solid var(--a-l);border-radius:10px;padding:8px 10px;display:flex;justify-content:space-between;gap:6px}.pg-estado small{color:var(--a-s)}
`;
