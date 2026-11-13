"use client";
// Herramientas comunes del panel: la «llave» de esta pestaña, pedidos al puente (/api/panel/accion) y la ventana de confirmación.
import { useState } from "react";

export const SESION = "__sesion__"; // entró con la Cuenta FUNGIRAK: la llave la pone el servidor, el navegador no manda ninguna
export const cab = (llave, extra = {}) => (llave === SESION ? extra : { "x-admin-key": llave, ...extra });

export const num = (n) => (n === null || n === undefined || Number.isNaN(Number(n)) ? "—" : Number(n).toLocaleString("es-AR"));
export const pct = (a, b) => (b ? Math.min(100, Math.round((a / b) * 100)) : 0);
export const fechaHora = (f) => (f ? new Date(f).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) : "—");
export const fecha = (f) => (f ? new Date(f).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "2-digit" }) : "—");

// Pide algo a una app (o a «cuenta» / «correo») a través del puente. Devuelve { ok, status, d }.
export async function pedir(llave, app, ruta, metodo = "GET", cuerpo) {
  try {
    const r = await fetch("/api/panel/accion", { method: "POST", headers: cab(llave, { "Content-Type": "application/json" }), cache: "no-store", body: JSON.stringify({ app, ruta, metodo, cuerpo }) });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, d };
  } catch { return { ok: false, status: 0, d: { error: "Sin conexión." } }; }
}
// Lo mismo contra muchas apps a la vez, de a 6 para no saturar.
export async function pedirATodas(llave, apps, ruta) {
  const out = []; let i = 0;
  const trabajar = async () => { while (i < apps.length) { const a = apps[i++]; out.push({ app: a, ...(await pedir(llave, a.id, typeof ruta === "function" ? ruta(a) : ruta)) }); } };
  await Promise.all(Array.from({ length: 6 }, trabajar));
  return out;
}

// Confirmación propia (nunca confirm() del navegador). Uso: const [conf, ventana] = useConfirmar(); … {ventana} … await conf({ t, d, peligro, motivo })
export function useConfirmar() {
  const [st, setSt] = useState(null);
  const conf = (o) => new Promise((res) => setSt({ ...o, res }));
  const cerrar = (v) => { st?.res(v); setSt(null); };
  const ventana = !st ? null : (
    <div className="pn-modal" role="dialog" aria-modal="true" aria-labelledby="pn-modal-t" onKeyDown={(e) => e.key === "Escape" && cerrar(null)}>
      <form className="pn-card pn-modal-c" onSubmit={(e) => { e.preventDefault(); cerrar({ motivo: String(new FormData(e.currentTarget).get("motivo") || "").trim(), valor: String(new FormData(e.currentTarget).get("valor") || "").trim() }); }}>
        <h2 id="pn-modal-t">{st.t}</h2>
        {st.d && <p className="pn-nota">{st.d}</p>}
        {st.valor && <label className="pn-campo">{st.valor}<input className="pn-in" name="valor" required defaultValue={st.valorInicial || ""} autoFocus /></label>}
        {st.motivo !== false && <label className="pn-campo">Motivo <small>(queda en la auditoría)</small><input className="pn-in" name="motivo" required={!!st.peligro} maxLength={200} autoFocus={!st.valor} /></label>}
        <div className="pn-acc" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="pn-b pn-b2" onClick={() => cerrar(null)}>Cancelar</button>
          <button className={`pn-b${st.peligro ? " pn-b-rojo" : ""}`}>{st.boton || "Confirmar"}</button>
        </div>
      </form>
    </div>
  );
  return [conf, ventana];
}

export const CSS_EXTRA = `
.pn-modal{position:fixed;inset:0;z-index:100;background:rgba(5,8,12,.55);display:grid;place-items:center;padding:16px;backdrop-filter:blur(3px)}
.pn-modal-c{width:min(460px,100%);display:grid;gap:12px;padding:22px}.pn-modal-c h2{margin:0;font-size:18px}
.pn-campo{display:grid;gap:6px;font-weight:600;font-size:13px}.pn-campo small{color:var(--s);font-weight:500}
.pn-b-rojo{background:var(--r);color:#fff}
.pn-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:110;background:var(--t);color:var(--c);padding:10px 16px;border-radius:12px;font-weight:700;font-size:13.5px;box-shadow:0 10px 30px rgba(0,0,0,.3)}
@media (max-width:860px){.pn-toast{bottom:84px}}
.pn-ficha{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px 16px;margin:0}
.pn-ficha div{border-bottom:1px dashed var(--l);padding:5px 0}.pn-ficha dt{font-size:11.5px;color:var(--s)}.pn-ficha dd{margin:0;font-weight:700;overflow-wrap:anywhere}
.pn-item{display:grid;gap:6px;border:1px solid var(--l);border-radius:12px;padding:12px}.pn-item p{margin:0;overflow-wrap:anywhere}
.pn-item.sel{border-color:var(--ac);background:var(--ac2)}
.pn-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;color:var(--s);font-size:12.5px}
.pn-cols{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.6fr);gap:12px}@media (max-width:900px){.pn-cols{grid-template-columns:1fr}}
.pn-lista-p{list-style:none;margin:0;padding:0;display:grid;gap:4px}.pn-lista-p button{width:100%;text-align:left;display:grid;gap:2px;padding:10px 12px;border-radius:10px;border:1px solid transparent;background:none;color:var(--t);font:inherit;cursor:pointer}
.pn-lista-p button:hover{background:var(--f)}.pn-lista-p button.on{border-color:var(--ac);background:var(--ac2)}.pn-lista-p small{color:var(--s);font-size:12px}
.pn-barras{display:grid;gap:8px}.pn-fila-b{display:grid;grid-template-columns:120px 1fr 64px;gap:10px;align-items:center;font-size:13px}.pn-fila-b span{color:var(--s);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pn-fila-b b{text-align:right;font-variant-numeric:tabular-nums}
.pn-fila-b div{height:10px;border-radius:99px;background:var(--f);overflow:hidden}.pn-fila-b i{display:block;height:100%;background:var(--ac);border-radius:99px}
.pn-fila-b i.b{background:var(--az)}.pn-fila-b i.r{background:var(--r)}
.pn-calor td{text-align:center;font-variant-numeric:tabular-nums}.pn-alerta-l{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.pn-alerta-l li{display:flex;gap:10px;align-items:flex-start;padding:11px 12px;border-radius:12px;background:var(--f);border-left:4px solid var(--s);cursor:pointer}
.pn-alerta-l li.r{border-left-color:var(--r)}.pn-alerta-l li.a{border-left-color:var(--am)}.pn-alerta-l li.v{border-left-color:var(--ac)}.pn-alerta-l b{display:block}.pn-alerta-l small{color:var(--s)}

.pn-sw{width:38px;height:22px;border-radius:99px;border:0;background:var(--l);position:relative;cursor:pointer;padding:0;vertical-align:middle}
.pn-sw i{position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.pn-sw.on{background:var(--am)}.pn-sw.on.rojo{background:var(--r)}.pn-sw.on i{transform:translateX(16px)}.pn-sw:disabled{opacity:.5;cursor:default}
textarea.pn-in{width:100%;min-height:80px;resize:vertical;font:inherit}
`;
