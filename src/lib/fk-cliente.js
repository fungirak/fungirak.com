"use client";
// La cuenta FUNGIRAK vista desde fungirak.com: ¿hay sesión? ¿qué apps usás? (solo nombre, foto y apps; nunca la contraseña).
// fungirak.com no guarda la sesión: le pregunta a cuenta.fungirak.com, que solo responde a los sitios del Studio.
import { useEffect, useState } from "react";

// (en pruebas, una etiqueta <meta name="fk-cuenta"> la cambia por la cuenta local, igual que en la barra)
export const cuentaUrl = () => (typeof document !== "undefined" && document.querySelector('meta[name="fk-cuenta"]')?.content) || "https://cuenta.fungirak.com";
// las apps que entran con la cuenta FUNGIRAK (las de la lista de la cuenta central), por dirección
export const APPS_FK = {
  "dertin.fungirak.com": "dertin", "atlasfit-pro.fungirak.com": "atlas", "mitour.fungirak.com": "mitour", "atalaya.fungirak.com": "atalaya",
  "musgui.fungirak.com": "musgui", "escuela-del-mate.fungirak.com": "mate", "escueladelasador.fungirak.com": "asador", "surco.fungirak.com": "surco",
  "micoteca.fungirak.com": "micoteca", "sin-vueltas.fungirak.com": "sinvueltas", "cronicasdefungi.fungirak.com": "cronicas", "hoy.fungirak.com": "hoy", "cv.fungirak.com": "cv", "preguntas.fungirak.com": "preguntas", "carta-al-futuro.fungirak.com": "carta-al-futuro",
};
let pedido = null;
export function useFk() {
  const [yo, setYo] = useState(null);
  useEffect(() => {
    pedido ??= fetch(`${cuentaUrl()}/api/yo`, { credentials: "include", cache: "no-store" }).then((r) => r.json()).catch(() => ({ sesion: false, caida: true }));
    pedido.then(setYo);
  }, []);
  return yo;
}
// Qué botón mostrar para una app: Abrir (ya la usás), Probar con tu cuenta (sesión, todavía no), o Abrir + Entrar con FUNGIRAK (sin sesión).
export function botonesApp(url, yo) {
  let host = ""; try { host = new URL(url).host; } catch {}
  const id = APPS_FK[host];
  if (!id || !yo || yo.caida) return { abrir: url }; // si la cuenta no responde, solo «Abrir»
  const entrar = `${url.replace(/\/$/, "")}/api/fungirak/entrar?volver=/`;
  if (yo?.sesion) return { abrir: entrar, usada: (yo.apps || []).some((a) => a.id === id) };
  return { abrir: url, entrar };
}
