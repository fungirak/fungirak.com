"use client";
// Historias (la foto de la portada): una de presentación por app, sitio y juego; «Ver más en historias» abre las 5 propias de esa
// app y, al terminar, sigue con la presentación de la que viene. Se pasan tocando a los costados o deslizando; mantener apretado pausa.
// Cada una se puede compartir o bajar como imagen 1080×1920 (/historias/<app>/<n>) para subirla a Instagram.
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { PERFIL } from "@/data/perfil";
import { avisarPorMail } from "@/lib/avisoMail";
import { APPS_HISTORIAS, portadaDe, propiasDe, nombreDe, logoDe, colorDe, inicioDeHoy, fuentesDe, hojaFuentes } from "@/data/historias";

const DURA = 6500; // ms por historia

const LIKES = "fgk-hst-likes";
const leerLikes = () => { try { return new Set(JSON.parse(localStorage.getItem(LIKES) || "[]")); } catch { return new Set(); } };

export default function Historias({ desde = null, onClose, onAplauso, aplausos = {} }) {
  const { lang } = useLang();
  const es = lang !== "en";
  const N = APPS_HISTORIAS.length;
  const [idx, setIdx] = useState(() => { const i = APPS_HISTORIAS.findIndex((p) => p.id === desde); return i >= 0 ? i : inicioDeHoy(N); });
  const [dentro, setDentro] = useState(null); // null = presentación; 0..4 = las propias
  const [pausa, setPausa] = useState(false);
  const [prog, setProg] = useState(0);
  const [aviso, setAviso] = useState("");
  const [likes, setLikes] = useState(leerLikes); // un ❤ por persona y por app (suma un aplauso a su card)
  const [resp, setResp] = useState(null); // texto de la respuesta mientras se escribe (pausa la historia)
  const [enviando, setEnviando] = useState(false);
  const toque = useRef({ x: 0, y: 0, t: 0, largo: null });
  const p = APPS_HISTORIAS[idx];
  const propias = propiasDe(p, lang);
  const slide = dentro === null ? null : propias[dentro];
  const nombre = nombreDe(p, lang);

  const siguiente = () => {
    setProg(0);
    if (dentro === null) { setIdx((i) => (i + 1) % N); return; }
    if (dentro < propias.length - 1) { setDentro(dentro + 1); return; }
    setDentro(null); setIdx((i) => (i + 1) % N); // terminó las de esta app: sigue la presentación de la próxima
  };
  const anterior = () => {
    setProg(0);
    if (dentro === null) { setIdx((i) => (i - 1 + N) % N); return; }
    if (dentro > 0) setDentro(dentro - 1); else setDentro(null);
  };
  // lo último de cada función, para el reloj y el teclado (sin rearmarlos en cada render)
  const fn = useRef({});
  useEffect(() => { fn.current = { siguiente, anterior, onClose }; });

  // el reloj de cada historia
  const avance = useRef(0);
  useEffect(() => { avance.current = 0; }, [idx, dentro]);
  useEffect(() => {
    if (pausa) return;
    let raf, ultimo = performance.now();
    const paso = (t) => {
      avance.current = Math.min(1, avance.current + (t - ultimo) / DURA); ultimo = t;
      setProg(avance.current);
      if (avance.current >= 1) { avance.current = 0; fn.current.siguiente(); }
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [pausa]);

  // teclado, scroll de fondo y precarga del logo que viene
  useEffect(() => {
    const k = (e) => { if (e.target.closest?.("input,textarea")) { if (e.key === "Escape") e.target.blur(); return; } if (e.key === "ArrowRight") fn.current.siguiente(); else if (e.key === "ArrowLeft") fn.current.anterior(); else if (e.key === "Escape") fn.current.onClose(); else if (e.key === " ") { e.preventDefault(); setPausa((x) => !x); } };
    addEventListener("keydown", k);
    const antes = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", k); document.body.style.overflow = antes; };
  }, []);
  useEffect(() => { const img = new Image(); img.src = logoDe(APPS_HISTORIAS[(idx + 1) % N]); }, [idx, N]);
  // la tipografía de cada app (y la de la que viene), desde Google Fonts, una sola vez
  useEffect(() => {
    for (const a of [APPS_HISTORIAS[idx], APPS_HISTORIAS[(idx + 1) % N]]) {
      const href = hojaFuentes(a); if (!href || document.getElementById(`hst-f-${a.id}`)) continue;
      const l = document.createElement("link"); l.id = `hst-f-${a.id}`; l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
    }
  }, [idx, N]);

  const abajo = (e) => {
    if (e.target.closest?.("input,form")) return;
    toque.current = { x: e.clientX, y: e.clientY, t: Date.now(), largo: setTimeout(() => setPausa(true), 220) };
  };
  const arriba = (e) => {
    if (e.target.closest?.("input,form")) return;
    const t = toque.current; clearTimeout(t.largo);
    const dx = e.clientX - t.x, dy = e.clientY - t.y, largo = Date.now() - t.t > 220;
    if (pausa && largo) { setPausa(false); return; }
    if (dy > 90 && Math.abs(dy) > Math.abs(dx)) return onClose(); // deslizar para abajo: cerrar
    if (Math.abs(dx) > 50) return dx < 0 ? siguiente() : anterior();
    if (e.target.closest?.("a,button")) return;
    const r = e.currentTarget.getBoundingClientRect();
    (e.clientX - r.left < r.width * 0.32 ? anterior : siguiente)();
  };

  const imagen = `/historias/${p.id}/${dentro === null ? 0 : dentro + 1}`;
  const compartir = async () => {
    setPausa(true); setAviso("");
    try {
      const blob = await (await fetch(imagen)).blob();
      const f = new File([blob], `fungirak-${p.id}-${dentro === null ? 0 : dentro + 1}.png`, { type: "image/png" });
      const link = `https://fungirak.com/?historia=${p.id}`;
      if (navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title: nombre, text: link });
      else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = f.name; a.click(); setAviso(es ? "Imagen guardada: subila a tus historias" : "Image saved: post it to your stories"); }
    } catch { /* cancelado */ }
  };

  const dioLike = likes.has(p.id);
  const darLike = () => {
    if (dioLike) return;
    const n = new Set(likes).add(p.id); setLikes(n);
    try { localStorage.setItem(LIKES, JSON.stringify([...n])); } catch { /* modo privado */ }
    onAplauso?.(p.id);
    avisarPorMail(`❤️ Le dieron like a la historia de ${nombre}`, { App: nombre, Historia: dentro === null ? "presentación" : `${dentro + 1} de 5`, Idioma: lang }).catch(() => {});
  };
  const responder = async (e) => {
    e.preventDefault();
    const texto = (resp || "").trim();
    if (texto.length < 3 || enviando) return;
    setEnviando(true); setAviso("");
    try {
      const r = await fetch("/api/muro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tipo: "comentario", app: p.id, texto }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) { setAviso(d.error === "links" ? (es ? "Sin links, porfa" : "No links, please") : d.error === "lenguaje" ? (es ? "Ese lenguaje no va" : "Mind the language") : d.error === "limite" ? (es ? "Escribiste mucho: probá en un rato" : "Too many: try later") : (es ? "No se pudo mandar" : "Could not send")); return; }
      avisarPorMail(`💬 Respondieron la historia de ${nombre}`, { App: nombre, Respuesta: texto, Historia: dentro === null ? "presentación" : `${dentro + 1} de 5` }).catch(() => {});
      setResp(null); setPausa(false); setAviso(es ? "¡Gracias! Quedó en los comentarios de la app 💬" : "Thanks! It's in the app's comments 💬");
    } finally { setEnviando(false); }
  };
  const color = colorDe(p);
  const fu = fuentesDe(p);
  const estilo = { "--c": color, ...(fu ? { "--hd": `'${fu[0]}', var(--font-display)`, "--hb": `'${fu[1]}', var(--font-body)` } : {}) };
  const barras = dentro === null ? [0] : propias.map((_, i) => i);
  const actual = dentro === null ? 0 : dentro;
  const portada = portadaDe(p, lang);

  return (
    <div className="hst" role="dialog" aria-modal="true" aria-label={es ? `Historias de FUNGIRAK: ${nombre}` : `FUNGIRAK stories: ${nombre}`}>
      <div className="hst-velo" onClick={onClose} />
      {/* en la compu, como Instagram web: la anterior y la siguiente a los costados, chiquitas, y flechas */}
      {[-1, 1].map((d) => { const v = APPS_HISTORIAS[(idx + d + N) % N]; return (
        <button key={d} type="button" className={`hst-vecina ${d < 0 ? "izq" : "der"}`} style={{ "--c": colorDe(v) }} aria-label={nombreDe(v, lang)} onClick={() => { setProg(0); setDentro(null); setIdx((idx + d + N) % N); }}>
          <img src={logoDe(v)} alt="" width={56} height={56} /><b>{nombreDe(v, lang)}</b>
        </button>); })}
      <button type="button" className="hst-flecha izq" aria-label={es ? "Anterior" : "Previous"} onClick={anterior}>‹</button>
      <button type="button" className="hst-flecha der" aria-label={es ? "Siguiente" : "Next"} onClick={siguiente}>›</button>
      <div className="hst-cel" style={estilo} onPointerDown={abajo} onPointerUp={arriba} onPointerCancel={() => clearTimeout(toque.current.largo)}>
        <div className="hst-fondo" aria-hidden="true"><span /><span /><span /></div>
        <div className="hst-barras" aria-hidden="true">
          {barras.map((i) => <i key={i}><b style={{ transform: `scaleX(${i < actual ? 1 : i === actual ? prog : 0})` }} /></i>)}
        </div>
        <header className="hst-cab">
          {dentro === null
            ? <><img src="/img/fotoPerfil-200.webp" alt="" width={32} height={32} className="hst-yo" /><b>fungirak</b><span>{idx + 1}/{N}</span></>
            : <><img src={logoDe(p)} alt="" width={32} height={32} className="hst-mini" /><b>{nombre}</b><span>{actual + 1}/5</span></>}
          <button type="button" className="hst-x" aria-label={es ? "Cerrar" : "Close"} onClick={onClose}>✕</button>
        </header>

        <div className="hst-cuerpo" key={`${idx}-${dentro}`} aria-live="polite">
          {dentro === null ? (
            <>
              <img className="hst-icono" src={logoDe(p)} alt="" width={132} height={132} />
              <h2 className="hst-nombre">{nombre}</h2>
              <p className="hst-from">from <b>FUNGIRAK</b></p>
              <p className="hst-frase">{portada.frase}</p>
              {portada.sub && <p className="hst-sub">{portada.sub}</p>}
              <button type="button" className="hst-mas" onClick={() => { setProg(0); setDentro(0); }}>{es ? "Ver más en historias" : "See more in stories"} <span aria-hidden="true">→</span></button>
            </>
          ) : slide.tipo === "dato" ? (
            <><p className="hst-ojo">{es ? "EN NÚMEROS" : "BY THE NUMBERS"}</p><p className="hst-numero">{slide.n}</p><p className="hst-frase">{slide.texto}</p></>
          ) : slide.tipo === "pills" ? (
            <><p className="hst-ojo">{slide.ojo}</p><div className="hst-pills">{slide.items.map((x, i) => <span key={x} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>{x}</span>)}</div></>
          ) : slide.tipo === "entrar" ? (
            <>
              <img className="hst-icono" src={logoDe(p)} alt="" width={112} height={112} />
              <p className="hst-frase">{slide.texto}</p>
              <a className="hst-mas" href={p.url} target="_blank" rel="noopener noreferrer">{slide.boton} <span aria-hidden="true">↗</span></a>
              <p className="hst-sub">{slide.sub || (es ? "Entrás con tu cuenta FUNGIRAK: una sola para todas las apps." : "Sign in with your FUNGIRAK account: one for every app.")}</p>
            </>
          ) : (
            <>{slide.emoji && <p className="hst-emoji" aria-hidden="true">{slide.emoji}</p>}<p className="hst-ojo">{slide.ojo}</p><p className="hst-frase hst-grande">{slide.texto}</p>{slide.sub && slide.sub !== slide.texto && <p className="hst-sub">{slide.sub}</p>}</>
          )}
        </div>

        <footer className="hst-pie">
          {resp === null ? (
            <button type="button" className="hst-responder" onClick={() => { setResp(""); setPausa(true); }}>{es ? `Responder a ${nombre}…` : `Reply to ${nombre}…`}</button>
          ) : (
            <form className="hst-form" onSubmit={responder}>
              <input autoFocus maxLength={240} value={resp} onChange={(e) => setResp(e.target.value)} placeholder={es ? "Tu respuesta (se publica en los comentarios)" : "Your reply (posted in the comments)"} aria-label={es ? "Tu respuesta" : "Your reply"} />
              <button type="submit" disabled={enviando || (resp || "").trim().length < 3} aria-label={es ? "Enviar" : "Send"}>➤</button>
              <button type="button" onClick={() => { setResp(null); setPausa(false); }} aria-label={es ? "Cancelar" : "Cancel"}>✕</button>
            </form>
          )}
          {resp === null && <>
            <button type="button" className={`hst-like${dioLike ? " si" : ""}`} onClick={darLike} aria-pressed={dioLike} aria-label={es ? "Me gusta" : "Like"}><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M12 20.6 10.6 19.3C5.6 14.8 2.3 11.8 2.3 8.1 2.3 5.1 4.6 2.8 7.6 2.8c1.7 0 3.3.8 4.4 2.1 1.1-1.3 2.7-2.1 4.4-2.1 3 0 5.3 2.3 5.3 5.3 0 3.7-3.3 6.7-8.3 11.2L12 20.6z" /></svg><small>{aplausos?.[p.id] || 0}</small></button>
            <button type="button" className="hst-icon" onClick={compartir} aria-label={es ? "Compartir" : "Share"}>📤</button>
          </>}
        </footer>
        {pausa && resp === null && <span className="hst-pausa" aria-hidden="true">❚❚</span>}
        {aviso && <p className="hst-aviso" role="status">{aviso}</p>}
      </div>
      <p className="hst-ayuda" aria-hidden="true">{es ? `Tocá a los costados para pasar · ${PERFIL.alias}` : `Tap the sides to move · ${PERFIL.alias}`}</p>
    </div>
  );
}
