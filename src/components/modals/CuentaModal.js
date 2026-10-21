"use client";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";

const CUENTA = "https://cuenta.fungirak.com";
const EDADES = [["13-17", "13-17"], ["18-24", "18-24"], ["25-34", "25-34"], ["35-44", "35-44"], ["45-54", "45-54"], ["55+", "55+"]];
const CLIENTE = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

// Tu cuenta FUNGIRAK desde fungirak.com: el botón oficial de Google abre (o crea) tu cuenta central
// sin salir de acá. La sesión es la misma cookie de cuenta.fungirak.com (mismo sitio a los ojos del navegador).
export default function CuentaModal({ onClose }) {
  const caja = useRef(null);
  const cred = useRef("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sesion, setSesion] = useState(undefined); // undefined = cargando, null = sin sesión, objeto = sesión
  const [alta, setAlta] = useState(null);
  const [edad, setEdad] = useState("");
  const [acepto, setAcepto] = useState(false);

  useEffect(() => {
    fetch(`${CUENTA}/api/yo`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setSesion(d?.sesion ? d : null))
      .catch(() => setSesion(null));
  }, []);

  const mandar = async (credential) => {
    if (credential) cred.current = credential;
    setBusy(true); setError("");
    try {
      const r = await fetch(`${CUENTA}/api/google`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: cred.current, edad: edad || undefined, acepto: acepto || undefined }),
      }).then((x) => x.json());
      if (r.error) throw new Error(r.error);
      if (r.falta === "alta") { setAlta({ email: r.email, nombre: r.nombre }); setBusy(false); return; }
      const yo = await fetch(`${CUENTA}/api/yo`, { credentials: "include" }).then((x) => x.json());
      setSesion(yo?.sesion ? yo : null);
      setAlta(null);
    } catch (e) { setError(e.message || "No se pudo."); }
    setBusy(false);
  };

  useEffect(() => {
    if (!CLIENTE || !caja.current || sesion) return;
    let montado = true;
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true;
    s.onload = () => {
      if (!montado || !window.google) return;
      window.google.accounts.id.initialize({
        client_id: CLIENTE,
        callback: (r) => mandar(r.credential),
      });
      pintar();
    };
    // El botón de Google sigue el tema del sitio (claro: borde; oscuro: negro), es redondo como los botones del Studio y ocupa el ancho
    // de la ventana (entre 220 y 400 px, el máximo que permite Google). Se vuelve a dibujar si cambia el tema o el ancho.
    const pintar = () => {
      const c = caja.current;
      if (!montado || !c || !window.google) return;
      const oscuro = document.documentElement.dataset.theme === "dark";
      c.innerHTML = "";
      window.google.accounts.id.renderButton(c, { theme: oscuro ? "filled_black" : "outline", size: "large", shape: "pill", text: "continue_with",
        logo_alignment: "center", width: Math.round(Math.max(220, Math.min(400, c.clientWidth || 300))) });
    };
    const tema = new MutationObserver(pintar);
    tema.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    let t;
    const ancho = () => { clearTimeout(t); t = setTimeout(pintar, 200); };
    window.addEventListener("resize", ancho);
    document.head.appendChild(s);
    return () => { montado = false; tema.disconnect(); window.removeEventListener("resize", ancho); clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesion]);

  const salir = async () => {
    setBusy(true);
    try { await fetch(`${CUENTA}/api/salir`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: "{}" }); } catch {}
    setSesion(null); setBusy(false);
  };

  return (
    <Modal onClose={onClose} color="#3CF2A0" eyebrow="FUNGIRAK Studio" titulo="Tu cuenta" bajada="Una sola cuenta para todas las apps del Studio. Entrá con Google sin salir de acá.">
      {sesion === undefined && <p>Cargando…</p>}
      {sesion && !alta && (
        <div>
          <p><b>Estás entrado como @{sesion.usuario}</b>{sesion.nombre ? ` (${sesion.nombre})` : ""}.</p>
          <p style={{ marginTop: 8 }}>Con esta misma cuenta entrás a las {sesion.total} apps del Studio con «Seguir como…».</p>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <a className="btn" href={`${CUENTA}/?seccion=cuenta`} target="_blank" rel="noopener">Abrir mi cuenta</a>
            <button className="btn ghost" onClick={salir} disabled={busy}>{busy ? "Saliendo…" : "Salir"}</button>
          </div>
        </div>
      )}
      {!sesion && !alta && (
        <div>
          {error && <p style={{ color: "var(--peligro, #e5484d)" }}>{error}</p>}
          {CLIENTE ? <div ref={caja} className="google-btn" /> : <p>Entrá desde <a href={`${CUENTA}/entrar?volver=https://fungirak.com`}>cuenta.fungirak.com</a>.</p>}
          {busy && <p style={{ textAlign: "center", fontSize: 14 }}>Entrando…</p>}
          <p style={{ fontSize: 13, marginTop: 14, opacity: 0.75 }}>¿Ya tenés cuenta? También podés entrar con usuario y contraseña en <a href={`${CUENTA}/entrar?volver=https://fungirak.com`}>cuenta.fungirak.com</a>.</p>
        </div>
      )}
      {alta && (
        <form onSubmit={(e) => { e.preventDefault(); mandar(cred.current); }}>
          <p>Google te reconoció como <b>{alta.email}</b>, pero todavía no tenés cuenta FUNGIRAK. Falta poco.</p>
          {error && <p style={{ color: "var(--peligro, #e5484d)" }}>{error}</p>}
          <label style={{ display: "block", margin: "12px 0 4px" }}>Edad
            <select className="big-input" value={edad} onChange={(e) => setEdad(e.target.value)} required style={{ width: "100%", marginTop: 4 }}>
              <option value="">Elegí</option>
              {EDADES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "12px 0", fontSize: 14 }}>
            <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} required style={{ marginTop: 3 }} />
            <span>Acepto los <a href={`${CUENTA}/legal/terminos`} target="_blank" rel="noopener">términos</a> y la <a href={`${CUENTA}/legal/privacidad`} target="_blank" rel="noopener">privacidad</a>.</span>
          </label>
          <button className="btn" disabled={busy || !edad || !acepto} style={{ width: "100%" }}>{busy ? "Creando…" : "Crear mi cuenta"}</button>
        </form>
      )}
    </Modal>
  );
}
