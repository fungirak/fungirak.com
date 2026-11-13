"use client";
// Métricas para decidir (funciones 1, 2, 3, 4, 5 y 9): embudo de la cuenta, retención por camada, qué app crece o cae,
// de dónde son las personas, ingresos por mes y velocidad de cada sitio.
import { useEffect, useState } from "react";
import { num, pct, pedir } from "./api";

const EV = { visita: "Vieron la entrada", crear: "Empezaron a crear cuenta", creada: "Crearon la cuenta", entrar: "Entraron", autorizar: "Vincularon una app", app: "Usaron una app" };
function Barras({ filas, max: m, clase = "", sufijo = "" }) {
  const max = m || Math.max(1, ...filas.map((f) => f[1]));
  return <div className="pn-barras">{filas.map(([k, v, extra]) => <div key={k} className="pn-fila-b"><span title={k}>{k}</span><div><i className={clase} style={{ width: `${pct(v, max)}%` }} /></div><b>{num(v)}{sufijo}{extra ? <small className="pn-nota"> {extra}</small> : null}</b></div>)}</div>;
}
const semana = (dias, desde, hasta) => (dias || []).slice(desde, hasta).reduce((t, x) => t + (x.cuentas || 0) + (x.personas || 0), 0);

export default function Metricas({ llave, filas, base }) {
  const [emb, setEmb] = useState(null), [ret, setRet] = useState(null), [prov, setProv] = useState(null);
  useEffect(() => {
    pedir(llave, "cuenta", "/api/admin?que=embudo").then((r) => setEmb(r.ok ? r.d.filas || [] : []));
    pedir(llave, "cuenta", "/api/admin?que=retencion").then((r) => setRet(r.ok ? r.d.filas || [] : []));
    pedir(llave, "cuenta", "/api/admin?que=provincias").then((r) => setProv(r.ok ? r.d.filas || [] : []));
  }, [llave]);
  // 3: crecimiento — últimos 7 días contra los 7 anteriores, con la serie diaria de cada app (las que la tienen)
  const crec = filas.filter((f) => f.a?.ok && (f.a.dias || []).length >= 10).map((f) => { const d = f.a.dias, n = d.length; const ahora = semana(d, n - 7, n), antes = semana(d, Math.max(0, n - 14), n - 7); return { f, ahora, antes, dif: antes ? Math.round(((ahora - antes) / antes) * 100) : ahora ? 100 : 0 }; })
    .sort((a, b) => b.dif - a.dif);
  // 5: ingresos por mes (pagos aprobados)
  const meses = Object.entries((base.d?.planes?.pagos || []).filter((p) => p.estado === "aprobado").reduce((m, p) => { const k = String(p.creado).slice(0, 7); m[k] = (m[k] || 0) + (Number(p.monto) || 0); return m; }, {})).sort();
  const porPlan = Object.entries((base.d?.planes?.pagos || []).filter((p) => p.estado === "aprobado").reduce((m, p) => { m[p.plan] = (m[p.plan] || 0) + (Number(p.monto) || 0); return m; }, {})).sort((a, b) => b[1] - a[1]);
  // 9: velocidad
  const vel = (base.d?.correo?.estado || []).filter((s) => s.ms).sort((a, b) => b.ms - a.ms);
  const embTot = Object.entries((emb || []).reduce((m, x) => { m[x.evento] = (m[x.evento] || 0) + x.n; return m; }, {}));
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="pn-dos">
        <section className="pn-card"><h2>Embudo de la cuenta · 30 días</h2>
          {!emb ? <p className="pn-nota">Cargando…</p> : !embTot.length ? <p className="pn-nota">Sin datos todavía.</p> : <Barras filas={embTot.map(([k, v]) => [EV[k] || k, v])} />}
        </section>
        <section className="pn-card"><h2>Quién crece y quién cae · 7 días contra los 7 anteriores</h2>
          {!crec.length ? <p className="pn-nota">Todavía no hay series diarias suficientes.</p> :
            <div className="pn-barras">{crec.map(({ f, ahora, dif }) => <div key={f.id} className="pn-fila-b"><span>{f.emoji} {f.nombre}</span><div><i className={dif < 0 ? "r" : ""} style={{ width: `${Math.min(100, Math.abs(dif))}%` }} /></div><b style={{ color: dif < 0 ? "var(--r)" : "var(--ac)" }}>{dif > 0 ? "+" : ""}{dif}%<small className="pn-nota"> ({num(ahora)})</small></b></div>)}</div>}
        </section>
      </div>
      <section className="pn-card"><h2>Retención por camada <small className="pn-nota">· de los que se anotaron cada semana, cuántos volvieron</small></h2>
        {!ret ? <p className="pn-nota">Cargando…</p> : !ret.length ? <p className="pn-nota">Sin altas en las últimas 10 semanas.</p> :
          <div className="pn-tabla-caja"><table className="pn-tabla pn-calor"><thead><tr><th>Semana</th><th>Altas</th><th>Volvieron a los 7 días</th><th>A los 30 días</th></tr></thead>
            <tbody>{ret.map((r) => { const c = (n) => ({ background: `color-mix(in srgb, var(--ac) ${pct(n, r.altas)}%, transparent)` }); const edad = (Date.now() - new Date(r.semana).getTime()) / 864e5;
              const celda = (n, d) => (edad < d + 7 ? <td className="pn-nota" title="Todavía no pasó el tiempo">—</td> : <td style={c(n)}>{pct(n, r.altas)}%</td>);
              return <tr key={r.semana}><td style={{ textAlign: "left" }}>{r.semana}</td><td>{num(r.altas)}</td>{celda(r.v7, 7)}{celda(r.v30, 30)}</tr>; })}</tbody></table></div>}
      </section>
      <div className="pn-dos">
        <section className="pn-card"><h2>De dónde son · cuentas FUNGIRAK</h2>
          {!prov ? <p className="pn-nota">Cargando…</p> : <Barras filas={prov.slice(0, 15).map((p) => [p.provincia === "?" ? "Sin decir" : p.provincia, p.n])} clase="b" />}
        </section>
        <section className="pn-card"><h2>Ingresos</h2>
          {!meses.length ? <p className="pn-nota">Todavía no hay pagos aprobados.</p> : <><p className="pn-nota" style={{ marginBottom: 8 }}>Por mes</p><Barras filas={meses.map(([k, v]) => [k, Math.round(v)])} sufijo=" $" />
            <p className="pn-nota" style={{ margin: "12px 0 8px" }}>Por plan</p><Barras filas={porPlan.map(([k, v]) => [k, Math.round(v)])} clase="b" sufijo=" $" /></>}
        </section>
      </div>
      <section className="pn-card"><h2>Velocidad de respuesta de cada sitio <small className="pn-nota">· los más lentos arriba</small></h2>
        {!vel.length ? <p className="pn-nota">Sin datos del vigía.</p> : <Barras filas={vel.map((s) => [s.nombre, s.ms])} clase={""} sufijo=" ms" />}
      </section>
    </div>
  );
}
