"use client";
// Un sello de tinta del Pasaporte (lib/sello-svg.js): el mismo dibujo que en las apps y en la cuenta FUNGIRAK.
import { selloSVG, GLIFOS } from "@/lib/sello-svg";

export default function SelloTinta({ s, nombre, ok = true, tam = 96, className = "" }) {
  const html = selloSVG({ app: "fungirak", marca: "FUNGIRAK STUDIO", id: s.id, nombre: ok ? nombre : "???", glifo: s.glifo, color: "#00C853", ok, tam });
  return <span className={`sello-tinta ${className}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />;
}
// Solo el ícono de línea (para el anillo del pasaporte arriba y el cartelito de sello nuevo).
export function Glifo({ nombre, tam = 16 }) {
  return <svg viewBox="0 0 24 24" width={tam} height={tam} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={GLIFOS[nombre] || GLIFOS.estrella} /></svg>;
}
