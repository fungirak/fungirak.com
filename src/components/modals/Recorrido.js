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
  // Posiciones fijas y prolijas: cada grupo es un brazo de la constelación
  const estrellas = useMemo(() => {
    const out = [];
    SKILLS.forEach((g, gi) => {
      const ang0 = (gi / SKILLS.length) * Math.PI * 2 - Math.PI / 2;
      g.items.forEach((s, si) => {
        const r = 16 + (si / g.items.length) * 30;
        const ang = ang0 + (si % 2 ? 0.22 : -0.22) * (1 - si / g.items.length) + si * 0.05;
        out.push({ s, g: gi, x: 50 + Math.cos(ang) * r * 1.15, y: 50 + Math.sin(ang) * r });
      });
    });
    return out;
  }, []);
  const total = SKILLS.reduce((n, g) => n + g.items.length, 0);
  return (
    <Modal onClose={onClose} wide color="#8b5cf6" eyebrow={es ? "Skills" : "Skills"} titulo={es ? "Constelación de herramientas" : "Tool constellation"} bajada={es ? `${total} tecnologías que usé de verdad en proyectos y trabajo.` : `${total} technologies I've actually used at work and in projects.`}>
      <div className="modal-body">
        <div className="grupos">
          {SKILLS.map((g, i) => (
            <button key={i} className="chip" style={{ "--chip": g.color }} aria-pressed={grupo === i} onClick={() => setGrupo(grupo === i ? null : i)}>
              {tx(g.grupo, lang)} · {g.items.length}
            </button>
          ))}
        </div>
        <div className="constelacion">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {estrellas.map((e, i) => {
              const sig = estrellas[i + 1];
              if (!sig || sig.g !== e.g) return <line key={i} x1="50" y1="50" x2={estrellas.find((x) => x.g === e.g).x} y2={estrellas.find((x) => x.g === e.g).y} stroke={SKILLS[e.g].color} strokeWidth="0.25" opacity=".5" />;
              return <line key={i} x1={e.x} y1={e.y} x2={sig.x} y2={sig.y} stroke={SKILLS[e.g].color} strokeWidth={grupo === e.g ? 0.5 : 0.22} opacity={grupo === null || grupo === e.g ? 0.8 : 0.15} />;
            })}
          </svg>
          <div className="star" style={{ left: "50%", top: "50%", "--sc": "#00e676", fontFamily: "var(--font-display)" }}>🍄 fungirak</div>
          {estrellas.map((e, i) => (
            <span key={e.s} className={`star${grupo === e.g ? " on" : ""}`} style={{ left: `${e.x}%`, top: `${e.y}%`, "--sc": SKILLS[e.g].color, opacity: grupo === null || grupo === e.g ? 1 : 0.25, animationDelay: `${-i * 0.3}s` }}>
              {e.s}
            </span>
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
