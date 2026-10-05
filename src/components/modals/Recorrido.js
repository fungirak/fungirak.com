"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../Modal";
import { useLang, tx } from "@/lib/i18n";
import { FILOSOFIA, TIMELINE, SKILLS, CERTIFICADOS } from "@/data/perfil";

const COLORES_PILAR = ["#00c853", "#3b82f6", "#8b5cf6", "#f59e0b", "#ff6b35", "#ff3d7f", "#22b8cf"];

export function Filosofia({ onClose, abrir }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [vueltas, setVueltas] = useState([]);
  const toggle = (id) => setVueltas((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  return (
    <Modal onClose={onClose} wide color="#00c853" eyebrow={es ? "Filosofía" : "Philosophy"} titulo={es ? <>Cómo pienso, <span className="grad-text">cómo construyo</span></> : <>How I think, <span className="grad-text">how I build</span></>} label={es ? "Filosofía" : "Philosophy"}>
      <div className="modal-body">
        <p className="manifiesto">&ldquo;{tx(FILOSOFIA.frase, lang)}&rdquo;</p>
        <p>{tx(FILOSOFIA.intro, lang)}</p>
        <h3>🃏 {es ? "Tocá cada carta para darla vuelta" : "Tap each card to flip it"} · {vueltas.length}/{FILOSOFIA.pilares.length}</h3>
        <div className="pilares">
          {FILOSOFIA.pilares.map((p, i) => (
            <button key={p.id} className={`pilar${vueltas.includes(p.id) ? " flip" : ""}`} style={{ "--pc": COLORES_PILAR[i % COLORES_PILAR.length], animation: `rise .5s ${i * 0.06}s both` }} onClick={() => toggle(p.id)} aria-pressed={vueltas.includes(p.id)}>
              <div className="pilar-inner">
                <div className="pilar-face front">
                  <span className="ico">{p.icono}</span>
                  <b>{tx(p.titulo, lang)}</b>
                  <small>{es ? "Tocá para leer →" : "Tap to read →"}</small>
                </div>
                <div className="pilar-face back">{tx(p.texto, lang)}</div>
              </div>
            </button>
          ))}
        </div>
        {vueltas.length === FILOSOFIA.pilares.length && (
          <div className="resultado" style={{ marginTop: 18 }}>
            <b className="display">{es ? "¡Leíste todo mi manifiesto! 🍄" : "You read my whole manifesto! 🍄"}</b>
            <p style={{ margin: "6px 0 12px" }}>{es ? "Si te identificaste, ya tenemos algo en común. ¿Charlamos?" : "If it resonated, we already have something in common. Shall we talk?"}</p>
            <button className="btn" onClick={() => abrir("hablemos")}>{es ? "Hablemos" : "Let's talk"} 👋</button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function Trayectoria({ onClose, abrir }) {
  const { lang } = useLang();
  const es = lang === "es";
  const lista = useRef(null);
  useEffect(() => {
    const raiz = lista.current?.closest(".modal");
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { root: raiz, threshold: 0.25 }
    );
    lista.current?.querySelectorAll("li").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);
  return (
    <Modal onClose={onClose} color="#22b8cf" eyebrow={es ? "Trayectoria" : "Journey"} titulo={es ? <>De Santo Tomé <span className="grad-text">al mundo</span></> : <>From Santo Tomé <span className="grad-text">to the world</span></>} label={es ? "Trayectoria" : "Journey"} bajada={es ? "Bajá despacio: cada año se enciende." : "Scroll slowly: every year lights up."}>
      <div className="modal-body">
        <ol className="timeline" ref={lista}>
          {TIMELINE.map((t) => (
            <li key={t.año + t.es}>
              <span className="dot">{t.icono}</span>
              <b>{t.año}</b>
              <p>{tx(t, lang)}</p>
            </li>
          ))}
        </ol>
        <div className="acciones">
          <button className="btn blue" onClick={() => abrir("experiencia")}>🏛️ {es ? "Experiencia" : "Experience"}</button>
          <button className="btn violet" onClick={() => abrir("educacion")}>🎓 {es ? "Educación" : "Education"}</button>
          <button className="btn amber" onClick={() => abrir("certificados")}>📜 {es ? "Certificados" : "Certificates"}</button>
        </div>
      </div>
    </Modal>
  );
}

export function Skills({ onClose }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [grupo, setGrupo] = useState(null);
  const caja = useRef(null);
  const [tam, setTam] = useState({ w: 0, h: 0 });

  // Mide el área disponible (y se recalcula si cambia el tamaño)
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setTam({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Posiciones sin solapamiento: cada grupo arranca en su brazo de la constelación
  // y después las pills se empujan entre sí hasta que ninguna pisa a otra.
  const estrellas = useMemo(() => {
    const { w, h } = tam;
    if (!w || !h) return [];
    const nodos = [];
    SKILLS.forEach((g, gi) => {
      const ang0 = (gi / SKILLS.length) * Math.PI * 2 - Math.PI / 2;
      g.items.forEach((s, si) => {
        const r = 0.2 + (si / g.items.length) * 0.27;
        const ang = ang0 + (si % 2 ? 0.25 : -0.25) * (1 - si / (g.items.length + 2));
        nodos.push({ s, g: gi, x: w / 2 + Math.cos(ang) * r * w, y: h / 2 + Math.sin(ang) * r * h, ancho: s.length * 7.2 + 26, alto: 28 });
      });
    });
    const centro = { x: w / 2, y: h / 2, ancho: 118, alto: 32 };
    const margen = 8;
    for (let it = 0; it < 320; it++) {
      let movio = false;
      for (let a = 0; a < nodos.length; a++) {
        const A = nodos[a];
        for (const B of [...nodos.slice(a + 1), centro]) {
          const dx = B.x - A.x;
          const dy = B.y - A.y;
          const solX = (A.ancho + B.ancho) / 2 + margen - Math.abs(dx);
          const solY = (A.alto + B.alto) / 2 + margen - Math.abs(dy);
          if (solX > 0 && solY > 0) {
            movio = true;
            // Se separan por el eje que menos se pisa
            if (solX / (A.ancho + B.ancho) < solY / (A.alto + B.alto)) {
              const m = (solX / 2) * (dx >= 0 ? 1 : -1);
              A.x -= m;
              if (B !== centro) B.x += m;
              else A.x -= m;
            } else {
              const m = (solY / 2) * (dy >= 0 ? 1 : -1);
              A.y -= m;
              if (B !== centro) B.y += m;
              else A.y -= m;
            }
          }
        }
        // Dentro de la caja
        A.x = Math.min(w - A.ancho / 2 - 6, Math.max(A.ancho / 2 + 6, A.x));
        A.y = Math.min(h - A.alto / 2 - 6, Math.max(A.alto / 2 + 6, A.y));
      }
      if (!movio) break;
    }
    return nodos;
  }, [tam]);

  const total = SKILLS.reduce((n, g) => n + g.items.length, 0);
  const visible = (gi) => grupo === null || grupo === gi;
  return (
    <Modal onClose={onClose} wide color="#8b5cf6" eyebrow="Skills" titulo={es ? "Constelación de herramientas" : "Tool constellation"} bajada={es ? `${total} tecnologías que usé de verdad en proyectos y trabajo.` : `${total} technologies I've actually used at work and in projects.`}>
      <div className="modal-body">
        <div className="grupos">
          {SKILLS.map((g, i) => (
            <button key={i} className="chip" style={{ "--chip": g.color }} aria-pressed={grupo === i} onClick={() => setGrupo(grupo === i ? null : i)}>
              {tx(g.grupo, lang)} · {g.items.length}
            </button>
          ))}
        </div>

        <div className="constelacion" ref={caja}>
          <svg width={tam.w} height={tam.h} aria-hidden="true">
            {estrellas.map((e, i) => {
              const ant = estrellas[i - 1];
              const desde = ant && ant.g === e.g ? ant : { x: tam.w / 2, y: tam.h / 2 };
              return <line key={e.s} x1={desde.x} y1={desde.y} x2={e.x} y2={e.y} stroke={SKILLS[e.g].color} strokeWidth={grupo === e.g ? 2 : 1} opacity={visible(e.g) ? 0.55 : 0.08} />;
            })}
          </svg>
          <div className="star" style={{ left: "50%", top: "50%", "--sc": "#00e676", fontFamily: "var(--font-display)" }}>🍄 fungirak</div>
          {estrellas.map((e, i) => (
            <span key={e.s} className={`star${grupo === e.g ? " on" : ""}`} style={{ left: e.x, top: e.y, "--sc": SKILLS[e.g].color, opacity: visible(e.g) ? 1 : 0.2, animationDelay: `${-i * 0.3}s` }}>
              {e.s}
            </span>
          ))}
        </div>

        {/* En pantallas chicas: lista agrupada, legible y sin amontonar */}
        <div className="skills-lista">
          {SKILLS.map((g, gi) => (
            <div key={gi} style={{ opacity: visible(gi) ? 1 : 0.35 }}>
              <h3 style={{ color: g.color }}>{tx(g.grupo, lang)}</h3>
              <div className="stack">{g.items.map((s) => <span key={s} className="pill" style={{ borderColor: g.color }}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function Certificados({ onClose }) {
  const { lang } = useLang();
  const es = lang === "es";
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(null);
  const n = CERTIFICADOS.length;
  const mover = (d) => setI((x) => (x + d + n) % n);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const c = CERTIFICADOS[i];
  return (
    <Modal onClose={onClose} wide color="#f59e0b" eyebrow={es ? "Licencias y certificaciones" : "Licenses & certifications"} titulo={es ? `${n} certificados` : `${n} certificates`} bajada={es ? "Deslizá con las flechas. Tocá el del frente para verlo grande." : "Use the arrows. Tap the front one to enlarge it."}>
      <div className="modal-body">
        {zoom ? (
          <button onClick={() => setZoom(null)} style={{ border: 0, padding: 0, background: "none", cursor: "zoom-out", width: "100%" }}>
            <img src={zoom} alt="" style={{ width: "100%", borderRadius: 16, background: "#fff" }} />
          </button>
        ) : (
          <>
            <div className="carrusel">
              {CERTIFICADOS.map((x, k) => {
                let d = k - i;
                if (d > n / 2) d -= n;
                if (d < -n / 2) d += n;
                const vis = Math.abs(d) <= 2;
                return (
                  <button
                    key={k}
                    className="cert"
                    onClick={() => (d === 0 ? setZoom(x.img) : setI(k))}
                    tabIndex={vis ? 0 : -1}
                    aria-label={tx(x.nombre, lang)}
                    style={{
                      transform: `translateX(calc(-50% + ${d * 46}%)) translateZ(${-Math.abs(d) * 160}px) rotateY(${d * -24}deg)`,
                      zIndex: 10 - Math.abs(d),
                      opacity: vis ? 1 - Math.abs(d) * 0.28 : 0,
                      filter: d ? "saturate(.6)" : "none",
                      pointerEvents: vis ? "auto" : "none",
                    }}
                  >
                    <img src={x.img} alt="" loading="lazy" />
                  </button>
                );
              })}
            </div>
            <div className="cert-info">
              <b>{tx(c.nombre, lang)}</b>
              <span style={{ color: "var(--text-3)", fontSize: "0.86rem" }}>{c.emisor}{c.año ? ` · ${c.año}` : ""}</span>
            </div>
            <div className="cert-nav">
              <button className="btn ghost small" onClick={() => mover(-1)} aria-label={es ? "Anterior" : "Previous"}>←</button>
              <span className="pill">{i + 1} / {n}</span>
              <button className="btn ghost small" onClick={() => mover(1)} aria-label={es ? "Siguiente" : "Next"}>→</button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
