"use client";
import { useEffect, useRef } from "react";
import { Cruz } from "./Iconos";
import { useLang } from "@/lib/i18n";

// Modal accesible: Escape cierra, foco atrapado adentro, scroll del fondo bloqueado.
export default function Modal({ onClose, color, eyebrow, titulo, bajada, wide, full, children, head = true, label }) {
  const ref = useRef(null);
  const { ui } = useLang();

  useEffect(() => {
    const anterior = document.activeElement;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    // Si un campo de adentro ya tomó el foco (autoFocus), no se lo sacamos
    if (ref.current && !ref.current.contains(document.activeElement)) ref.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll('button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // Celular: cuando aparece el teclado, el modal sube y queda por encima (iPhone no achica la página solo)
    const vv = window.visualViewport;
    const ajustar = () => {
      if (!vv || !ref.current) return;
      const teclado = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      ref.current.parentElement.style.setProperty("--teclado", `${teclado}px`);
      ref.current.parentElement.style.setProperty("--alto-visible", `${vv.height}px`);
    };
    const alEnfocar = (e) => {
      if (!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      setTimeout(() => {
        ajustar();
        e.target.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 320);
    };
    vv?.addEventListener("resize", ajustar);
    vv?.addEventListener("scroll", ajustar);
    ref.current?.addEventListener("focusin", alEnfocar);
    const nodo = ref.current;
    ajustar();
    return () => {
      vv?.removeEventListener("resize", ajustar);
      vv?.removeEventListener("scroll", ajustar);
      nodo?.removeEventListener("focusin", alEnfocar);
      document.removeEventListener("keydown", onKey);
      html.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, [onClose]);

  return (
    <div className={`modal-backdrop${full ? " full" : ""}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        className={`modal${wide ? " wide" : ""}${full ? " full" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label || (typeof titulo === "string" ? titulo : undefined)}
        tabIndex={-1}
        style={color ? { "--c": color } : undefined}
      >
        <div className="modal-close-wrap">
          <button className="icon-btn modal-close" onClick={onClose} aria-label={ui.cerrar}>
            <Cruz />
          </button>
        </div>
        {head && (
          <header className="modal-head">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {titulo && <h2 className="display">{titulo}</h2>}
            {bajada && <p>{bajada}</p>}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
