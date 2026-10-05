"use client";
import { useEffect, useRef } from "react";
import { PROYECTOS } from "@/data/proyectos";

// Red de micelio: hilos orgánicos que conectan las cards que comparten industria,
// con pulsos de luz que viajan por ellos. No es un círculo: es una red viva.
const COLORES = ["#00e676", "#22b8cf", "#8b5cf6", "#f59e0b", "#3b82f6"];

function pares() {
  const out = [];
  for (let i = 0; i < PROYECTOS.length; i++)
    for (let j = i + 1; j < PROYECTOS.length; j++) {
      const a = PROYECTOS[i];
      const b = PROYECTOS[j];
      const comun = a.industrias.filter((x) => b.industrias.includes(x));
      // Todo lo de la fila 1 se conecta con su vecino: es el núcleo
      const vecinos = a.fila === 1 && b.fila === 1 && j === i + 1;
      if (comun.length || vecinos) out.push({ a: a.id, b: b.id, ind: comun[0] || null, seed: (i * 31 + j * 17) % 100 });
    }
  // Team Joy (el núcleo) se conecta con cada proyecto del estudio
  PROYECTOS.filter((p) => p.fila === 2).forEach((p, k) => out.push({ a: "teamjoy", b: p.id, ind: null, seed: 50 + k * 7, debil: true }));
  return out;
}

export default function Micelio({ filtro, hover }) {
  const ref = useRef(null);
  const estado = useRef({ filtro, hover });
  useEffect(() => {
    estado.current = { filtro, hover };
  }, [filtro, hover]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const lista = pares();
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let t = 0;

    const dibujar = () => {
      const padre = canvas.parentElement;
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(box.width * dpr) || canvas.height !== Math.round(box.height * dpr)) {
        canvas.width = Math.round(box.width * dpr);
        canvas.height = Math.round(box.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.width, box.height);

      const pos = {};
      padre.querySelectorAll("[data-card]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right < box.left || r.left > box.right) return;
        pos[el.dataset.card] = { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });

      const { filtro: f, hover: h } = estado.current;
      lista.forEach((p, i) => {
        const A = pos[p.a];
        const B = pos[p.b];
        if (!A || !B) return;
        const activo = (h && (p.a === h || p.b === h)) || (f && f !== "todas" && p.ind === f);
        const alpha = activo ? 0.85 : p.debil ? 0.1 : 0.22;
        const color = COLORES[i % COLORES.length];
        // Curva orgánica que ondula suave
        const mx = (A.x + B.x) / 2 + Math.sin(t / 900 + p.seed) * 26;
        const my = (A.y + B.y) / 2 + Math.cos(t / 1100 + p.seed) * 30 - 20;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.quadraticCurveTo(mx, my, B.x, B.y);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = activo ? 2.2 : 1.2;
        ctx.setLineDash(p.debil && !activo ? [2, 6] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pulso que viaja por el hilo
        if (!quieto && (activo || i % 3 === Math.floor(t / 2400) % 3)) {
          const k = ((t / (activo ? 1400 : 2600) + p.seed / 100) % 1 + 1) % 1;
          const x = (1 - k) * (1 - k) * A.x + 2 * (1 - k) * k * mx + k * k * B.x;
          const y = (1 - k) * (1 - k) * A.y + 2 * (1 - k) * k * my + k * k * B.y;
          ctx.globalAlpha = activo ? 1 : 0.6;
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(x, y, activo ? 3.4 : 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      ctx.globalAlpha = 1;
    };

    const loop = (ts) => {
      t = ts;
      dibujar();
      raf = requestAnimationFrame(loop);
    };
    if (quieto) {
      dibujar();
      const re = () => dibujar();
      window.addEventListener("resize", re);
      return () => window.removeEventListener("resize", re);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="mycelium" aria-hidden="true" />;
}
