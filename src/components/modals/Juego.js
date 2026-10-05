"use client";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { useLang } from "@/lib/i18n";
import { tocar, arpegio } from "@/lib/sonido";

/* =========================================================
   ESPORA · el juego oculto de fungirak.com
   Un hongo (Gabriel) vuela desde lo profundo del micelio hasta el bosque.
   10 niveles: subsuelo → búnker → raíces → superficie → bosque en código.
   ========================================================= */

const NIVELES = [
  { es: "Subsuelo profundo", en: "Deep underground", zona: "sub", cielo: ["#07040a", "#1a0f0a"], codigo: "#00e676", muro: "#3b2416", veta: "#00e676" },
  { es: "La red de hifas", en: "The hyphae network", zona: "sub", cielo: ["#060a08", "#16120c"], codigo: "#22e6a0", muro: "#432a18", veta: "#22b8cf" },
  { es: "Micelio despierto", en: "Mycelium awake", zona: "sub", cielo: ["#050b0a", "#0f1a14"], codigo: "#7dffb0", muro: "#4a3020", veta: "#8b5cf6" },
  { es: "El búnker", en: "The bunker", zona: "bunker", cielo: ["#0c0f14", "#1a1f28"], codigo: "#00e676", muro: "#4b5563", veta: "#ef4444" },
  { es: "Búnker: salida de emergencia", en: "Bunker: emergency exit", zona: "bunker", cielo: ["#0f1218", "#22262f"], codigo: "#ffcf3d", muro: "#5b6472", veta: "#f59e0b" },
  { es: "Raíces", en: "Roots", zona: "raiz", cielo: ["#120d08", "#2a1c10"], codigo: "#9be15d", muro: "#5a3a1e", veta: "#00e676" },
  { es: "Casi la superficie", en: "Almost the surface", zona: "raiz", cielo: ["#1a140c", "#3b2a16"], codigo: "#c8ff6b", muro: "#6b4423", veta: "#22b8cf" },
  { es: "La superficie", en: "The surface", zona: "sup", cielo: ["#0b1f3a", "#2b5c7a"], codigo: "#00e676", muro: "#3f2a1a", veta: "#00c853" },
  { es: "La red de los árboles", en: "The wood wide web", zona: "sup", cielo: ["#1a1035", "#d9655b"], codigo: "#7dffb0", muro: "#3a2618", veta: "#00e676" },
  { es: "El Bosque (Matrix)", en: "The Forest (Matrix)", zona: "bosque", cielo: ["#000805", "#002414"], codigo: "#00ff6a", muro: "#04140c", veta: "#00ff6a" },
];
const POR_NIVEL = 6; // obstáculos para pasar de nivel
const CHARS = Array.from("01アイウエオカキクケコサシスセソ01ハヒフヘホマミムメモヤユヨ01");

const rnd = (a, b) => a + Math.random() * (b - a);

export default function Juego({ onClose, sonido, onLogro }) {
  const { lang } = useLang();
  const es = lang === "es";
  const canvas = useRef(null);
  const juego = useRef(null);
  const [ui, setUi] = useState({ estado: "intro", puntos: 0, nivel: 1, esporas: 0, mejor: 0 });

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const fuente = getComputedStyle(document.documentElement).getPropertyValue("--f-display").trim() || "sans-serif";
    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf;
    let ultimo = performance.now();
    const mejorGuardado = (() => {
      try {
        return Number(localStorage.getItem("fgk-espora") || 0);
      } catch {
        return 0;
      }
    })();

    const g = {
      estado: "intro",
      y: 0,
      vy: 0,
      x: 0,
      rot: 0,
      obst: [],
      esporasLista: [],
      particulas: [],
      puntos: 0,
      esporas: 0,
      nivel: 1,
      pasados: 0,
      t: 0,
      banner: 0,
      mejor: mejorGuardado,
      lluvia: [],
      red: [],
      offset: 0,
      flash: 0,
    };
    juego.current = g;

    const medir = () => {
      const r = cv.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      // En celular el juego ocupa toda la pantalla; en compu, un lienzo cómodo dentro del modal
      const celular = matchMedia("(max-width: 700px)").matches;
      H = celular ? window.innerHeight : Math.max(360, Math.min(r.width * 1.25, window.innerHeight * 0.66, 640));
      cv.style.height = `${H}px`;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.x = Math.min(W * 0.28, 140);
      // Lluvia de código
      const cols = Math.ceil(W / 16);
      g.lluvia = Array.from({ length: cols }, (_, i) => ({ x: i * 16 + 8, y: rnd(-H, H), v: rnd(40, 120) }));
      // Red de micelio de fondo (nodos que se repiten con parallax)
      g.red = Array.from({ length: 26 }, () => ({ x: rnd(0, W * 2), y: rnd(0, H), r: rnd(1.5, 3.5) }));
    };
    medir();
    window.addEventListener("resize", medir);

    const conf = () => {
      const n = g.nivel - 1;
      return {
        vel: H * (0.34 + n * 0.028),
        hueco: H * Math.max(0.25, 0.36 - n * 0.012),
        separacion: Math.max(H * 0.55, W * 0.42) - n * 6,
        grav: H * 2.3,
        salto: -H * 0.63,
      };
    };

    const reiniciar = () => {
      g.y = H * 0.45;
      g.vy = 0;
      g.rot = 0;
      g.obst = [];
      g.esporasLista = [];
      g.particulas = [];
      g.puntos = 0;
      g.esporas = 0;
      g.nivel = 1;
      g.pasados = 0;
      g.banner = 1.6;
      g.flash = 0;
    };
    reiniciar();

    const nuevoObstaculo = (x) => {
      const c = conf();
      const margen = H * 0.1;
      const centro = rnd(margen + c.hueco / 2, H - margen - c.hueco / 2 - (["sup", "bosque"].includes(NIVELES[g.nivel - 1].zona) ? H * 0.08 : 0));
      g.obst.push({ x, centro, hueco: c.hueco, ancho: Math.max(52, W * 0.075), pasado: false, semilla: Math.random() });
      if (Math.random() < 0.65) g.esporasLista.push({ x: x + Math.max(52, W * 0.075) / 2, y: centro + rnd(-c.hueco * 0.25, c.hueco * 0.25), tomada: false });
    };

    const aletear = () => {
      if (g.estado === "intro" || g.estado === "perdiste" || g.estado === "ganaste") {
        if (g.estado !== "intro") reiniciar();
        g.estado = "jugando";
        setUi((u) => ({ ...u, estado: "jugando", puntos: 0, nivel: 1, esporas: 0 }));
      }
      g.vy = conf().salto;
      for (let i = 0; i < 5; i++) g.particulas.push({ x: g.x - 10, y: g.y + 8, vx: rnd(-80, -20), vy: rnd(-20, 60), vida: 0.6, c: NIVELES[g.nivel - 1].veta });
      if (sonido) tocar(523.25 + g.nivel * 20, { dur: 0.15, vol: 0.05, tipo: "sine" });
    };

    const perder = () => {
      g.estado = "perdiste";
      g.flash = 0.4;
      if (g.puntos > g.mejor) {
        g.mejor = g.puntos;
        try {
          localStorage.setItem("fgk-espora", String(g.puntos));
        } catch {}
      }
      if (sonido) tocar(130, { dur: 0.6, vol: 0.1, tipo: "sawtooth" });
      setUi({ estado: "perdiste", puntos: g.puntos, nivel: g.nivel, esporas: g.esporas, mejor: g.mejor });
    };

    // ---------- Dibujo ----------
    const hongo = (x, y, rot, escala = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(escala, escala);
      ctx.shadowColor = "#00e676";
      ctx.shadowBlur = 18;
      // Tallo
      ctx.fillStyle = "#f4efe6";
      ctx.beginPath();
      ctx.roundRect(-7, -2, 14, 20, 6);
      ctx.fill();
      // Sombrero
      const grad = ctx.createLinearGradient(0, -22, 0, 2);
      grad.addColorStop(0, "#00e676");
      grad.addColorStop(1, "#00a344");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-22, 2);
      ctx.quadraticCurveTo(-22, -24, 0, -24);
      ctx.quadraticCurveTo(22, -24, 22, 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      [[-10, -12, 3.6], [4, -16, 3], [13, -6, 2.6], [-2, -5, 2.2]].forEach(([a, b, r]) => {
        ctx.beginPath();
        ctx.arc(a, b, r, 0, Math.PI * 2);
        ctx.fill();
      });
      // Ojos (lentes de dev)
      ctx.fillStyle = "#1b1f44";
      ctx.beginPath();
      ctx.arc(-3.5, 6, 1.8, 0, Math.PI * 2);
      ctx.arc(3.5, 6, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1b1f44";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 10, 3, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.restore();
    };

    const fondo = (n, dt) => {
      const L = NIVELES[n - 1];
      const cielo = ctx.createLinearGradient(0, 0, 0, H);
      cielo.addColorStop(0, L.cielo[0]);
      cielo.addColorStop(1, L.cielo[1]);
      ctx.fillStyle = cielo;
      ctx.fillRect(0, 0, W, H);

      // Lluvia de código Matrix
      ctx.font = "13px monospace";
      const alfaCodigo = L.zona === "sup" ? 0.12 : L.zona === "bosque" ? 0.55 : 0.28;
      g.lluvia.forEach((c) => {
        c.y += c.v * dt * (L.zona === "bosque" ? 1.6 : 1);
        if (c.y > H + 40) c.y = rnd(-120, -10);
        for (let k = 0; k < 6; k++) {
          ctx.globalAlpha = alfaCodigo * (1 - k / 6);
          ctx.fillStyle = k === 0 ? "#e8fff0" : L.codigo;
          ctx.fillText(CHARS[(Math.floor(c.y / 16) + k + c.x) % CHARS.length], c.x, c.y - k * 15);
        }
      });
      ctx.globalAlpha = 1;

      // Red de micelio con parallax
      const off = (g.offset * 0.25) % (W * 2);
      ctx.strokeStyle = L.veta;
      ctx.lineWidth = 1;
      const pts = g.red.map((p) => ({ x: ((p.x - off + W * 2) % (W * 2)) - W * 0.2, y: L.zona === "sup" || L.zona === "bosque" ? H * 0.82 + (p.y / H) * H * 0.18 : p.y, r: p.r }));
      pts.forEach((a, i) => {
        pts.forEach((b, j) => {
          if (j <= i) return;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < W * 0.22) {
            ctx.globalAlpha = (1 - d / (W * 0.22)) * (L.zona === "bunker" ? 0.12 : 0.35);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 12, b.x, b.y);
            ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = L.veta;
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + Math.sin(g.t * 3 + p.x) * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Detalles por zona
      if (L.zona === "bunker") {
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let x = -((g.offset * 0.5) % 80); x < W; x += 80) ctx.fillRect(x, 0, 2, H);
        const luz = (Math.sin(g.t * 4) + 1) / 2;
        ctx.fillStyle = `rgba(239,68,68,${0.15 + luz * 0.25})`;
        ctx.beginPath();
        ctx.arc(W - 30, 26, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      if (L.zona === "raiz") {
        ctx.fillStyle = "rgba(0,200,83,0.25)";
        ctx.fillRect(0, 0, W, H * 0.05 * (n - 5));
      }
      if (L.zona === "sup" || L.zona === "bosque") {
        // Suelo con la red bajo tierra
        ctx.fillStyle = L.zona === "bosque" ? "#02140b" : "#2a1b10";
        ctx.fillRect(0, H * 0.82, W, H * 0.18);
        ctx.fillStyle = L.zona === "bosque" ? "#00ff6a" : "#00c853";
        ctx.fillRect(0, H * 0.82, W, 4);
        // Árboles lejanos
        ctx.fillStyle = L.zona === "bosque" ? "rgba(0,255,106,0.18)" : "rgba(10,30,20,0.55)";
        for (let x = -((g.offset * 0.35) % 140); x < W + 140; x += 140) {
          ctx.beginPath();
          ctx.moveTo(x, H * 0.82);
          ctx.lineTo(x + 30, H * 0.5);
          ctx.lineTo(x + 60, H * 0.82);
          ctx.fill();
        }
        if (L.zona === "sup" && n === 8) {
          ctx.fillStyle = "rgba(255,240,200,0.8)";
          ctx.beginPath();
          ctx.arc(W * 0.8, H * 0.18, 26, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const obstaculo = (o, L) => {
      const arriba = o.centro - o.hueco / 2;
      const abajo = o.centro + o.hueco / 2;
      const piso = ["sup", "bosque"].includes(L.zona) ? H * 0.82 : H;
      const pieza = (y0, y1, desdeArriba) => {
        if (y1 <= y0) return;
        if (L.zona === "bunker") {
          ctx.fillStyle = L.muro;
          ctx.fillRect(o.x, y0, o.ancho, y1 - y0);
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          for (let y = y0 + 10; y < y1; y += 22) ctx.fillRect(o.x + 6, y, o.ancho - 12, 4);
          ctx.fillStyle = L.veta;
          ctx.fillRect(o.x - 4, desdeArriba ? y1 - 10 : y0, o.ancho + 8, 10);
          return;
        }
        if (L.zona === "sup" || L.zona === "bosque") {
          // Tronco con copa (abajo) o rama colgante (arriba)
          ctx.fillStyle = L.zona === "bosque" ? "#04140c" : L.muro;
          ctx.fillRect(o.x + o.ancho * 0.25, y0, o.ancho * 0.5, y1 - y0);
          ctx.strokeStyle = L.veta;
          ctx.globalAlpha = 0.6;
          ctx.strokeRect(o.x + o.ancho * 0.25, y0, o.ancho * 0.5, y1 - y0);
          ctx.globalAlpha = 1;
          const cy = desdeArriba ? y1 : y0;
          ctx.fillStyle = L.zona === "bosque" ? "rgba(0,255,106,0.85)" : "#00a344";
          ctx.beginPath();
          ctx.ellipse(o.x + o.ancho / 2, cy, o.ancho * 0.85, 22, 0, 0, Math.PI * 2);
          ctx.fill();
          return;
        }
        // Raíz / hifa orgánica
        ctx.fillStyle = L.muro;
        ctx.beginPath();
        ctx.roundRect(o.x, y0, o.ancho, y1 - y0, 16);
        ctx.fill();
        ctx.strokeStyle = L.veta;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        for (let y = y0; y < y1; y += 8) {
          const xx = o.x + o.ancho / 2 + Math.sin(y * 0.05 + o.semilla * 10 + g.t * 2) * o.ancho * 0.28;
          y === y0 ? ctx.moveTo(xx, y) : ctx.lineTo(xx, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = L.veta;
        ctx.beginPath();
        ctx.arc(o.x + o.ancho / 2, desdeArriba ? y1 - 6 : y0 + 6, 5, 0, Math.PI * 2);
        ctx.fill();
      };
      pieza(0, arriba, true);
      pieza(abajo, piso, false);
    };

    // ---------- Bucle ----------
    const paso = (ahora) => {
      const dt = Math.min(0.033, (ahora - ultimo) / 1000);
      ultimo = ahora;
      g.t += dt;
      const L = NIVELES[g.nivel - 1];
      const c = conf();

      if (g.estado === "jugando") {
        g.offset += c.vel * dt;
        g.vy += c.grav * dt;
        g.y += g.vy * dt;
        g.rot = Math.max(-0.5, Math.min(1.1, g.vy / (H * 1.2)));

        const ultimoX = g.obst.length ? g.obst[g.obst.length - 1].x : -Infinity;
        if (ultimoX < W - c.separacion) nuevoObstaculo(Math.max(W + 20, ultimoX + c.separacion));
        g.obst.forEach((o) => (o.x -= c.vel * dt));
        g.esporasLista.forEach((e) => (e.x -= c.vel * dt));
        g.obst = g.obst.filter((o) => o.x + o.ancho > -10);
        g.esporasLista = g.esporasLista.filter((e) => e.x > -20 && !e.tomada);

        const piso = ["sup", "bosque"].includes(L.zona) ? H * 0.82 : H;
        const rad = 17;
        if (g.y + rad > piso || g.y - rad < 0) perder();
        for (const o of g.obst) {
          if (g.x + rad > o.x + 4 && g.x - rad < o.x + o.ancho - 4) {
            if (g.y - rad + 4 < o.centro - o.hueco / 2 || g.y + rad - 4 > o.centro + o.hueco / 2) {
              perder();
              break;
            }
          }
          if (!o.pasado && o.x + o.ancho < g.x) {
            o.pasado = true;
            g.puntos++;
            g.pasados++;
            if (g.pasados >= POR_NIVEL) {
              g.pasados = 0;
              if (g.nivel < NIVELES.length) {
                g.nivel++;
                g.banner = 1.8;
                if (sonido) arpegio([392, 523.25, 659.25]);
                onLogro?.(g.nivel);
              } else {
                g.estado = "ganaste";
                if (g.puntos > g.mejor) {
                  g.mejor = g.puntos;
                  try {
                    localStorage.setItem("fgk-espora", String(g.puntos));
                  } catch {}
                }
                if (sonido) arpegio([523.25, 659.25, 783.99, 1046.5]);
                onLogro?.(11);
                setUi({ estado: "ganaste", puntos: g.puntos, nivel: 10, esporas: g.esporas, mejor: g.mejor });
              }
            }
            setUi((u) => ({ ...u, puntos: g.puntos, nivel: g.nivel }));
          }
        }
        for (const e of g.esporasLista) {
          if (!e.tomada && Math.hypot(e.x - g.x, e.y - g.y) < 26) {
            e.tomada = true;
            g.esporas++;
            for (let i = 0; i < 10; i++) g.particulas.push({ x: e.x, y: e.y, vx: rnd(-120, 120), vy: rnd(-120, 120), vida: 0.5, c: "#fff6a8" });
            if (sonido) tocar(880, { dur: 0.12, vol: 0.05, tipo: "sine" });
            setUi((u) => ({ ...u, esporas: g.esporas }));
          }
        }
      } else if (g.estado === "intro") {
        g.offset += H * 0.15 * dt;
        g.y = H * 0.45 + Math.sin(g.t * 2.5) * 12;
        g.rot = Math.sin(g.t * 2.5) * 0.08;
      }

      fondo(g.nivel, dt);
      g.obst.forEach((o) => obstaculo(o, L));
      // Esporas
      g.esporasLista.forEach((e) => {
        ctx.fillStyle = "#fff6a8";
        ctx.shadowColor = "#fff6a8";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(e.x, e.y + Math.sin(g.t * 5 + e.x) * 3, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      // Partículas
      g.particulas.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vida -= dt;
        ctx.globalAlpha = Math.max(0, p.vida * 1.6);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      g.particulas = g.particulas.filter((p) => p.vida > 0);
      hongo(g.x, g.y, g.rot);

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.roundRect(10, 10, 170, 50, 12);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `800 22px ${fuente}, sans-serif`;
      ctx.fillText(String(g.puntos), 22, 42);
      ctx.font = "600 11px sans-serif";
      ctx.fillStyle = "#c8ffd9";
      ctx.fillText(`${es ? "NIVEL" : "LEVEL"} ${g.nivel}/10 · ✦ ${g.esporas}`, 70, 30);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(70, 38, 98, 6);
      ctx.fillStyle = L.veta;
      ctx.fillRect(70, 38, 98 * (g.pasados / POR_NIVEL), 6);

      // Cartel de nivel
      if (g.banner > 0 && g.estado !== "intro") {
        g.banner -= dt;
        ctx.globalAlpha = Math.min(1, g.banner);
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, H * 0.4 - 34, W, 68);
        ctx.fillStyle = L.veta;
        ctx.textAlign = "center";
        ctx.font = `800 22px ${fuente}, sans-serif`;
        ctx.fillText(`${es ? "NIVEL" : "LEVEL"} ${g.nivel}`, W / 2, H * 0.4 - 4);
        ctx.fillStyle = "#fff";
        ctx.font = "600 14px sans-serif";
        ctx.fillText(es ? L.es : L.en, W / 2, H * 0.4 + 20);
        ctx.textAlign = "left";
        ctx.globalAlpha = 1;
      }
      if (g.flash > 0) {
        g.flash -= dt;
        ctx.fillStyle = `rgba(255,255,255,${g.flash})`;
        ctx.fillRect(0, 0, W, H);
      }
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);

    const tecla = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        aletear();
      }
    };
    const toque = (e) => {
      e.preventDefault();
      aletear();
    };
    const visible = () => {
      ultimo = performance.now();
    };
    window.addEventListener("keydown", tecla);
    cv.addEventListener("pointerdown", toque);
    document.addEventListener("visibilitychange", visible);
    g.aletear = aletear;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", medir);
      window.removeEventListener("keydown", tecla);
      cv.removeEventListener("pointerdown", toque);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [es, sonido, onLogro]);

  return (
    <Modal onClose={onClose} wide full color="#00e676" head={false} label="La Espora">
      <div className="juego-lienzo" style={{ position: "relative", background: "#000", borderRadius: 28, overflow: "clip" }}>
        <canvas ref={canvas} style={{ display: "block", width: "100%", touchAction: "none", cursor: "pointer" }} aria-label={es ? "Juego Espora: tocá para volar" : "Spore game: tap to fly"} />
        {ui.estado !== "jugando" && (
          <div className="juego-overlay">
            {ui.estado === "intro" && (
              <>
                <div className="eyebrow" style={{ color: "#00e676" }}>{es ? "Juego oculto de fungirak" : "fungirak's hidden game"}</div>
                <h2 className="display">LA ESPORA</h2>
                <p>{es ? "Sos un hongo. Volá desde lo más profundo del micelio, pasá el búnker y las raíces, y llegá al Bosque. 10 niveles." : "You're a mushroom. Fly from deep in the mycelium, past the bunker and the roots, up to the Forest. 10 levels."}</p>
                <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>{es ? "Tocá, hacé clic o apretá espacio para volar · ✦ juntá esporas" : "Tap, click or press space to fly · ✦ collect spores"}</p>
              </>
            )}
            {ui.estado === "perdiste" && (
              <>
                <h2 className="display">{es ? "¡Uy! Te comió el micelio" : "Oops! The mycelium got you"}</h2>
                <p>{es ? `Nivel ${ui.nivel} · ${ui.puntos} puntos · ✦ ${ui.esporas} esporas` : `Level ${ui.nivel} · ${ui.puntos} points · ✦ ${ui.esporas} spores`}</p>
                <p style={{ fontSize: "0.85rem" }}>🏆 {es ? "Tu récord" : "Your best"}: {ui.mejor}</p>
              </>
            )}
            {ui.estado === "ganaste" && (
              <>
                <h2 className="display">🌳 {es ? "¡Llegaste al Bosque!" : "You reached the Forest!"}</h2>
                <p>{es ? `Pasaste los 10 niveles con ${ui.puntos} puntos y ${ui.esporas} esporas. Sos parte del micelio.` : `You beat all 10 levels with ${ui.puntos} points and ${ui.esporas} spores. You're part of the mycelium.`}</p>
              </>
            )}
            <button className="btn pulse" onClick={() => juego.current?.aletear?.()}>{ui.estado === "intro" ? (es ? "▶ Jugar" : "▶ Play") : es ? "↻ Otra vez" : "↻ Again"}</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
