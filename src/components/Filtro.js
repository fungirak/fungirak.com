"use client";
import { useMemo } from "react";
import { ofensivas } from "@/lib/filtro";
import { useLang } from "@/lib/i18n";

// Revisa uno o varios textos mientras se escriben. Devuelve las palabras ofensivas encontradas.
export function useFiltro(...textos) {
  const clave = textos.join("\u0001");
  return useMemo(() => ofensivas(clave.replace(/\u0001/g, " · ")), [clave]);
}

// Aviso en rojo, amable, que dice exactamente qué corregir
export function AvisoFiltro({ palabras }) {
  const { lang } = useLang();
  if (!palabras?.length) return null;
  const lista = palabras.slice(0, 3).map((p) => `«${p}»`).join(", ");
  return (
    <p className="aviso err" role="alert" style={{ marginTop: 8 }}>
      {lang === "es"
        ? <>🙏 Este es un espacio family friendly: {lista} no va acá. Corregilo y vas a poder enviar.</>
        : <>🙏 This is a family-friendly space: {lista} doesn&apos;t belong here. Fix it and you&apos;ll be able to send.</>}
    </p>
  );
}

// Clase para marcar el campo en rojo
export const claseFiltro = (texto) => (ofensivas(texto).length ? "campo-mal" : undefined);
