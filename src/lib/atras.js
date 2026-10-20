"use client";
// Botón «atrás» del celu (Android, gesto de iPhone, app instalada): que no te saque del sitio sin querer.
// - Lo que esté abierto (ventana, menú, foto ampliada) se apila; cada «atrás» cierra lo de más arriba, como en una app.
// - En la portada, en celu o con la app instalada, el primer «atrás» avisa «Tocá atrás otra vez para salir» y el segundo sale.
// Usa el historial del navegador: una marca por cada cosa abierta y una «guardia» debajo de todo. Los navegadores solo
// respetan esas marcas después de que la persona tocó algo, por eso la guardia se pone en el primer toque.
import { useEffect, useRef } from "react";

const esCelu = () => typeof window !== "undefined" && (matchMedia("(pointer: coarse)").matches || matchMedia("(display-mode: standalone)").matches);
const pila = []; // lo abierto, de abajo hacia arriba
let ignorar = 0; // «atrás» que hacemos nosotros al cerrar algo con la ✕ (no tienen que cerrar otra cosa)
let ultimo = 0;
let avisar = null;
let escuchando = false;

function alVolver() {
  if (ignorar > 0) { ignorar--; return; }
  const arriba = pila.pop();
  if (arriba) { arriba.porAtras = true; arriba.cerrar(); return; }
  if (!esCelu() || history.state?.fkGuardia) return;
  if (Date.now() - ultimo < 2200) { history.back(); return; } // segundo «atrás» seguido: ahora sí sale
  ultimo = Date.now();
  history.pushState({ fkGuardia: 1 }, "");
  avisar?.();
}
function escuchar() {
  if (escuchando || typeof window === "undefined") return;
  escuchando = true;
  window.addEventListener("popstate", alVolver);
}

// Para cualquier cosa que se abre encima (ventana, menú, foto): «atrás» la cierra. `cerrar` es lo mismo que hace la ✕.
export function useCerrarConAtras(abierto, cerrar) {
  const cerrarRef = useRef(cerrar);
  useEffect(() => { cerrarRef.current = cerrar; });
  useEffect(() => {
    if (!abierto) return;
    escuchar();
    const item = { cerrar: () => cerrarRef.current(), porAtras: false };
    pila.push(item);
    history.pushState({ fkVentana: pila.length }, "");
    return () => {
      // se cerró con la ✕, tocando afuera o desde el código: se saca su marca del historial
      const i = pila.indexOf(item);
      if (i >= 0) pila.splice(i, 1);
      if (!item.porAtras && history.state?.fkVentana) { ignorar++; history.back(); }
    };
  }, [abierto]);
}

// Una vez, en la página principal: la guardia y el aviso de «Tocá atrás otra vez para salir».
export function useGuardiaSalida(alAvisar) {
  useEffect(() => {
    avisar = alAvisar;
    escuchar();
    if (!esCelu()) return;
    const poner = () => { if (!history.state?.fkGuardia && !history.state?.fkVentana) history.pushState({ fkGuardia: 1 }, ""); };
    window.addEventListener("pointerdown", poner, { once: true });
    return () => { window.removeEventListener("pointerdown", poner); avisar = null; };
  }, [alAvisar]);
}
