import Imprimir from "./Imprimir";
import { PERFIL, LINKS, SOBRE_MI, EXPERIENCIA, EDUCACION, CERTIFICADOS, SKILLS, IDIOMAS, RECONOCIMIENTOS } from "@/data/perfil";
import { PROYECTOS } from "@/data/proyectos";
import "./cv.css";

export const metadata = {
  title: "CV · Gabriel Lazzarini",
  description: "Currículum de Gabriel Lazzarini (fungirak), desarrollador de software full stack de Santa Fe, Argentina.",
  alternates: { canonical: "/cv" },
};

const es = (v) => (v && typeof v === "object" ? v.es : v);

export default function CV() {
  return (
    <div className="cv-page">
      <Imprimir />
      <article className="cv">
        <header className="cv-head">
          <img src="/img/fotoPerfil.jpg" alt="" width={96} height={96} />
          <div>
            <h1>{PERFIL.nombre}</h1>
            <p className="cv-rol">{es(PERFIL.rol)} · {PERFIL.edad} años</p>
            <p className="cv-contacto">
              {LINKS.email} · {LINKS.whatsappVisible} · {PERFIL.ciudad}
              <br />
              fungirak.com · linkedin.com/in/gabriel-lazzarini · github.com/fungirak
            </p>
          </div>
        </header>

        <section>
          <h2>Perfil</h2>
          {SOBRE_MI.es.slice(1).map((t) => <p key={t}>{t}</p>)}
        </section>

        <section>
          <h2>Experiencia</h2>
          {EXPERIENCIA.map((x) => (
            <div className="cv-item" key={es(x.lugar)}>
              <div className="cv-row"><b>{es(x.rol)} · {es(x.lugar)}</b><span>{es(x.desde)}</span></div>
              <div className="cv-sub">{es(x.org)}</div>
              <ul>{x.items.map((i) => <li key={i.es}>{i.es}</li>)}</ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Productos propios (FUNGIRAK Studio)</h2>
          <ul className="cv-proy">
            {PROYECTOS.filter((p) => p.url).map((p) => (
              <li key={p.id}><b>{es(p.nombre)}</b>{p.id === "negro" ? " (sitio homenaje, no oficial)" : ""} — {es(p.tagline)}. <span className="cv-sub">{p.url.replace("https://", "")}</span></li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Educación</h2>
          {EDUCACION.map((e) => (
            <div className="cv-row" key={e.años}><span><b>{es(e.nombre)}</b> · {e.inst}{e.estado ? ` · ${es(e.estado)}` : ""}</span><span>{e.años}</span></div>
          ))}
        </section>

        <section>
          <h2>Tecnologías</h2>
          {SKILLS.map((g) => <p key={g.grupo.es}><b>{g.grupo.es}:</b> {g.items.join(", ")}</p>)}
        </section>

        <section className="cv-2col">
          <div>
            <h2>Certificaciones</h2>
            <ul>{CERTIFICADOS.map((c) => <li key={es(c.nombre)}>{es(c.nombre)} · {c.emisor}{c.año ? ` (${c.año})` : ""}</li>)}</ul>
          </div>
          <div>
            <h2>Reconocimientos</h2>
            <ul>{RECONOCIMIENTOS.map((r) => <li key={r.fecha.es}>{r.nombre.es} · {r.texto.es} ({r.fecha.es})</li>)}</ul>
            <h2>Idiomas</h2>
            <ul>{IDIOMAS.map((i) => <li key={i.valor}>{i.nombre.es}: {i.nivel.es}</li>)}</ul>
          </div>
        </section>
        <footer className="cv-foot">🍄 FUNGIRAK Studio · fungirak.com</footer>
      </article>
    </div>
  );
}
