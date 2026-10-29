"use client";
// Formulario del concurso de ideas: email, nombre opcional, la idea y aceptar las bases (sin casilla premarcada).
import { useState } from "react";

const ERR = {
  email: "Revisá el email.",
  idea: "Contá tu idea en al menos 40 caracteres (hasta 1.200).",
  bases: "Para participar tenés que aceptar las bases.",
  "ya-ganaste": "Ese email ya ganó una edición: gracias por participar.",
  cerrado: "El concurso terminó.",
  despacio: "Mandaste varias seguidas. Probá en un rato.",
};
export default function Participar({ min, max }) {
  const [f, setF] = useState({ email: "", nombre: "", idea: "", acepto: false, _hp: "" });
  const [estado, setEstado] = useState(null);
  const [ok, setOk] = useState(null);
  const enviar = async (e) => {
    e.preventDefault();
    setEstado("enviando");
    try {
      const r = await fetch("/api/sorteo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.codigo) return setEstado(j.error || "error");
      setOk(j); setEstado(null);
    } catch { setEstado("error"); }
  };
  if (ok) return (
    <div className="sorteo-prox">
      <span>{ok.corregida ? "Idea actualizada" : "¡Tu idea está participando!"}</span>
      <b>{ok.codigo}</b>
      <small>Guardá tu código. Si querés cambiar la idea antes del cierre, mandala de nuevo con el mismo email.</small>
    </div>
  );
  return (
    <form className="concurso-form" onSubmit={enviar}>
      <label>Tu email<input type="email" required maxLength={120} autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      <label>Tu nombre (opcional)<input maxLength={60} autoComplete="given-name" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></label>
      <label>Tu idea: qué sitio te gustaría, para qué y para quién
        <textarea required minLength={min} maxLength={max} rows={5} value={f.idea} onChange={(e) => setF({ ...f, idea: e.target.value })} />
        <small>{f.idea.length}/{max}</small>
      </label>
      <input className="concurso-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f._hp} onChange={(e) => setF({ ...f, _hp: e.target.value })} />
      <label className="concurso-check"><input type="checkbox" checked={f.acepto} onChange={(e) => setF({ ...f, acepto: e.target.checked })} /> Leí y acepto las bases del concurso.</label>
      {estado && estado !== "enviando" && <p className="concurso-err">{ERR[estado] || "No se pudo mandar. Probá de nuevo."}</p>}
      <button className="concurso-btn" disabled={estado === "enviando"}>{estado === "enviando" ? "Mandando…" : "Mandar mi idea"}</button>
    </form>
  );
}
