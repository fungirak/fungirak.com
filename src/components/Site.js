"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LangCtx, UI, tx } from "@/lib/i18n";
import { SELLOS, leerSellos, guardarSellos } from "@/lib/pasaporte";
import { NOTAS, tocar, arpegio } from "@/lib/sonido";
import Nav from "./Nav";
import Hero from "./Hero";
import Donar from "./Donar";
import Footer from "./Footer";
import ProyectoModal from "./modals/ProyectoModal";
import { SaberMas, Experiencia, Educacion, Reconocimientos, Idiomas, Privacidad } from "./modals/PerfilModales";
import { Filosofia, Trayectoria, Skills, Certificados } from "./modals/Recorrido";
import Hablemos from "./modals/Hablemos";
import Bienvenida from "./modals/Bienvenida";
import Brief from "./modals/Brief";
import Comunidad from "./Comunidad";
import Juego from "./modals/Juego";
import { Pasaporte, Terminal, Quiz, GitHub, Instagram, YouTube } from "./modals/Extras";

const leer = (k, def) => {
  try {
    const v = localStorage.getItem(k);
    return v === null ? def : JSON.parse(v);
  } catch {
    return def;
  }
};
const guardar = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

// Qué sello da cada modal al abrirse
const SELLO_DE = { filosofia: "filosofia", trayectoria: "trayectoria", skills: "skills", certificados: "certificados", terminal: "terminal", youtube: "youtube" };
const ACORDE = ["teamjoy", "problematica", "libro-1", "libro-2", "ep"];

export default function Site() {
  const [lang, setLangState] = useState("es");
  const [tema, setTemaState] = useState("light");
  const [sonido, setSonidoState] = useState(false);
  const [sellos, setSellos] = useState([]);
  const [visitante, setVisitanteState] = useState(null);
  const [modal, setModal] = useState(null);
  const [payload, setPayload] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState(null);
  const [muro, setMuro] = useState({ huellas: [], ideas: [] });
  const tocadas = useRef(new Set());
  const [desdeIg, setDesdeIg] = useState(false);
  const listo = useRef(false);

  // Estado inicial desde el dispositivo
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- se lee localStorage una sola vez al montar */
    setLangState(leer("fgk-lang", navigator.language?.startsWith("es") ? "es" : "en"));
    setTemaState(document.documentElement.dataset.theme || "light");
    setSonidoState(leer("fgk-sonido", false));
    setSellos(leerSellos());
    const v = leer("fgk-visitante", null);
    setVisitanteState(v);
    /* eslint-enable react-hooks/set-state-in-effect */
    listo.current = true;

    // Contador de visitas (una por sesión) y números en vivo
    try {
      if (!sessionStorage.getItem("fgk-visita")) {
        sessionStorage.setItem("fgk-visita", "1");
        fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ evento: "visita" }) }).catch(() => {});
      }
    } catch {}
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
    fetch("/api/muro").then((r) => r.json()).then((m) => m?.huellas && setMuro(m)).catch(() => {});

    // Bienvenida estilo linktree para quien llega por primera vez (al instante si viene de Instagram)
    let ig = false;
    try {
      const q = new URLSearchParams(location.search);
      ig = /instagram/i.test(q.get("utm_source") || q.get("from") || q.get("ref") || "") || q.has("ig") || /instagram\.com/i.test(document.referrer);
    } catch {}
    setDesdeIg(ig);
    let id;
    if (!v || (ig && !v.busca)) id = setTimeout(() => setModal((m) => m || "bienvenida"), ig ? 700 : 1600);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Si el visitante cambia el modo de su sistema con el sitio abierto, lo seguimos (salvo que haya elegido a mano)
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const cambio = (e) => {
      try {
        if (sessionStorage.getItem("fgk-tema")) return;
      } catch {}
      const t = e.matches ? "dark" : "light";
      document.documentElement.dataset.theme = t;
      setTemaState(t);
    };
    mq.addEventListener("change", cambio);
    return () => mq.removeEventListener("change", cambio);
  }, []);

  const setLang = useCallback((l) => {
    setLangState(l);
    guardar("fgk-lang", l);
  }, []);

  const setTema = useCallback((t) => {
    setTemaState(t);
    document.documentElement.dataset.theme = t;
    try {
      sessionStorage.setItem("fgk-tema", t);
    } catch {}
  }, []);

  const setSonido = useCallback((s) => {
    setSonidoState(s);
    guardar("fgk-sonido", s);
    if (s) arpegio([261.63, 329.63, 392.0, 523.25]);
  }, []);

  const setVisitante = useCallback((fn) => {
    setVisitanteState((prev) => {
      const v = typeof fn === "function" ? fn(prev) : fn;
      guardar("fgk-visitante", v);
      return v;
    });
  }, []);

  const confeti = useCallback(async () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = (await import("canvas-confetti")).default;
    c({ particleCount: 140, spread: 80, origin: { y: 0.7 }, colors: ["#00e676", "#22b8cf", "#8b5cf6", "#f59e0b", "#ff3d7f"] });
  }, []);

  const sellar = useCallback(
    (id) => {
      setSellos((prev) => {
        if (prev.includes(id) || !SELLOS.some((s) => s.id === id)) return prev;
        const next = [...prev, id];
        guardarSellos(next);
        const s = SELLOS.find((x) => x.id === id);
        setToast({ k: Date.now(), s });
        if (next.length === SELLOS.length) {
          setTimeout(() => {
            confeti();
            setModal("pasaporte");
          }, 900);
          fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ evento: "pasaporte" }) }).catch(() => {});
        }
        return next;
      });
    },
    [confeti]
  );

  const abrir = useCallback(
    (key, data = null) => {
      // Secciones de la página: se baja hasta ellas en vez de abrir un modal
      if (key === "donar" || key === "comunidad" || key === "proyectos") {
        setModal(null);
        setTimeout(() => document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
        return;
      }
      setPayload(data);
      setModal(key);
      if (key.startsWith("proyecto:")) sellar(key.slice(9));
      else if (SELLO_DE[key]) sellar(SELLO_DE[key]);
    },
    [sellar]
  );
  const cerrar = useCallback(() => setModal(null), []);

  // Ctrl+K / Cmd+K abre la terminal
  useEffect(() => {
    const k = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        abrir("terminal");
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [abrir]);

  // Modo músico: cada card toca su nota; las 5 centrales juntas dan el sello del acorde
  const onSound = useCallback(
    (id) => {
      if (!sonido) return;
      tocar(NOTAS[id]);
      if (ACORDE.includes(id)) {
        tocadas.current.add(id);
        if (ACORDE.every((x) => tocadas.current.has(x))) {
          setTimeout(() => arpegio(ACORDE.map((x) => NOTAS[x])), 400);
          sellar("acorde");
        }
      }
    },
    [sonido, sellar]
  );

  const onLogroJuego = useCallback((n) => n >= 3 && sellar("juego"), [sellar]);

  const onAplauso = useCallback((id) => {
    setStats((s) => ({ ...(s || {}), aplausos: { ...(s?.aplausos || {}), [id]: (s?.aplausos?.[id] || 0) + 1 } }));
    fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ evento: "aplauso", id }) }).catch(() => {});
  }, []);

  const ctx = useMemo(() => ({ lang, ui: UI[lang], setLang }), [lang, setLang]);

  const comunes = { onClose: cerrar, abrir };
  let vista = null;
  if (modal?.startsWith("proyecto:")) vista = <ProyectoModal id={modal.slice(9)} {...comunes} stats={stats} onAplauso={onAplauso} />;
  else
    switch (modal) {
      case "bienvenida":
        vista = (
          <Bienvenida
            onClose={cerrar}
            setVisitante={setVisitante}
            desdeInstagram={desdeIg}
            onListo={(d) => {
              sellar("bienvenida");
              const scroll = (id) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
              if (d === "brief") abrir("brief");
              else if (d === "contratar") abrir("saber");
              else if (d === "colega") abrir("skills");
              else if (d === "redes") abrir("hablemos", { interes: "redes" });
              else if (d === "donar") { cerrar(); scroll("donar"); }
              else { cerrar(); scroll("proyectos"); }
            }}
          />
        );
        break;
      case "saber":
        vista = <SaberMas {...comunes} visitante={visitante} />;
        break;
      case "experiencia":
        vista = <Experiencia {...comunes} />;
        break;
      case "educacion":
        vista = <Educacion {...comunes} />;
        break;
      case "reconocimientos":
        vista = <Reconocimientos {...comunes} />;
        break;
      case "idiomas":
        vista = <Idiomas {...comunes} />;
        break;
      case "privacidad":
        vista = <Privacidad {...comunes} />;
        break;
      case "filosofia":
        vista = <Filosofia {...comunes} />;
        break;
      case "trayectoria":
        vista = <Trayectoria {...comunes} />;
        break;
      case "skills":
        vista = <Skills {...comunes} />;
        break;
      case "certificados":
        vista = <Certificados {...comunes} />;
        break;
      case "hablemos":
        vista = <Hablemos onClose={cerrar} visitante={visitante} setVisitante={setVisitante} previo={payload} onConfetti={confeti} onBrief={() => abrir("brief")} />;
        break;
      case "brief":
        vista = <Brief onClose={cerrar} visitante={visitante} setVisitante={setVisitante} previo={payload} onConfetti={confeti} />;
        break;
      case "pasaporte":
        vista = <Pasaporte {...comunes} sellos={sellos} visitante={visitante} />;
        break;
      case "terminal":
        vista = <Terminal {...comunes} setTema={setTema} setLang={setLang} tema={tema} />;
        break;
      case "quiz":
        vista = <Quiz {...comunes} onListo={() => sellar("quiz")} />;
        break;
      case "github":
        vista = <GitHub {...comunes} />;
        break;
      case "juego":
        vista = <Juego onClose={cerrar} sonido={sonido} onLogro={onLogroJuego} />;
        break;
      case "youtube":
        vista = <YouTube {...comunes} />;
        break;
      case "instagram":
        vista = <Instagram {...comunes} />;
        break;
    }

  return (
    <LangCtx.Provider value={ctx}>
      <Nav abrir={abrir} tema={tema} setTema={setTema} sonido={sonido} setSonido={setSonido} sellos={sellos} visitante={visitante} />
      <Hero abrir={abrir} sellos={sellos} onSound={onSound} visitante={visitante} marco={muro.huellas.slice(0, 16).map((h) => h.emoji)} />
      <Comunidad muro={muro} setMuro={setMuro} sellar={sellar} />
      <Donar stats={stats} abrir={abrir} />
      <Footer abrir={abrir} stats={stats} />
      {vista}
      {toast && (
        <div className="toast" key={toast.k} role="status" onAnimationEnd={(e) => e.target === e.currentTarget && setToast(null)}>
          <span className="ico">{toast.s.icono}</span>
          <span>
            <b>{UI[lang].sello}</b> {tx(toast.s, lang)} · {sellos.length}/{SELLOS.length}
          </span>
        </div>
      )}
    </LangCtx.Provider>
  );
}
