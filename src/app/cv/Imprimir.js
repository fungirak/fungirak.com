"use client";
import Link from "next/link";

export default function Imprimir() {
  return (
    <div className="cv-bar">
      <Link href="/">← fungirak.com</Link>
      <button className="btn" onClick={() => window.print()}>⬇ Descargar PDF</button>
      <a className="btn ghost" href="/api/vcard">📇 Agendar contacto</a>
    </div>
  );
}
