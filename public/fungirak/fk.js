/* FUNGIRAK · barra de la cuenta (sin frameworks, mismo archivo en todas las apps y en fungirak.com).
   <fk-barra app="surco" entrar="/api/fungirak/entrar" local="1"></fk-barra>
   - app: id de la app ("fungirak" en la portada). entrar: dónde empieza «Entrar con FUNGIRAK» en esta app.
   - local="1": la app ya tiene su propia sesión abierta (entonces no ofrece «Seguir como…»).
   - modo="portal": además muestra tu foto o «Acceder / Crear cuenta» (fungirak.com y apps sin botón propio).
     crear-desde="1500": ancho mínimo para mostrar también «Crear cuenta» (por defecto 641).
   Lee tu sesión en cuenta.fungirak.com (solo nombre, foto y qué apps usás). Nunca ve tu contraseña ni guarda nada sensible. */
(() => {
  if (customElements.get("fk-barra")) return;
  const CUENTA = (document.querySelector('meta[name="fk-cuenta"]')?.content || "https://cuenta.fungirak.com").replace(/\/$/, "");
  // los íconos de las apps viven al lado de este archivo (/fungirak/apps/), así la grilla se ve aunque la cuenta no responda
  const BASE = (() => { try { return new URL(".", document.currentScript.src).href; } catch { return "/fungirak/"; } })();
  const APPS = [
    ["dertin", "Dertin", "https://dertin.fungirak.com", "Afinidades"], ["atlas", "Atlas Fit Pro", "https://atlasfit-pro.fungirak.com", "Entrenamiento"],
    ["mitour", "MiTour", "https://mitour.fungirak.com", "Viajes"], ["atalaya", "Atalaya", "https://atalaya.fungirak.com", "Ciberseguridad"],
    ["musgui", "Musgui", "https://musgui.fungirak.com", "Mascota"], ["mate", "Escuela del Mate", "https://escuela-del-mate.fungirak.com", "Mate"],
    ["asador", "Escuela del Asador", "https://escueladelasador.fungirak.com", "Asado"], ["surco", "Surco", "https://surco.fungirak.com", "Huerta"],
    ["micoteca", "Micoteca", "https://micoteca.fungirak.com", "Hongos"], ["sinvueltas", "Sin Vueltas", "https://sin-vueltas.fungirak.com", "Trámites"],
    ["cronicas", "Las Crónicas de Fungi", "https://cronicasdefungi.fungirak.com", "Juego 3D"],
  ].map(([id, nombre, url, tag]) => ({ id, nombre, url, tag, icono: `${BASE}apps/${id}.webp` }));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const guardar = (k, v, store = sessionStorage) => { try { store.setItem(k, v); } catch {} };
  const leer = (k, store = sessionStorage) => { try { return store.getItem(k); } catch { return null; } };
  const embudo = (evento, app) => { try { fetch(`${CUENTA}/api/embudo`, { method: "POST", mode: "cors", credentials: "omit", keepalive: true, headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ evento, app }) }).catch(() => {}); } catch {} };
  let pedido = null;
  // Una sola consulta por página (con sesión, se recuerda 60 s en la pestaña para no repetirla al navegar; sin sesión, nunca).
  const yo = () => (pedido ??= (async () => {
    const c = leer("fk.yo"); if (c) { try { const d = JSON.parse(c); if (Date.now() - d.t < 60000) return d.v; } catch {} }
    try { const r = await fetch(`${CUENTA}/api/yo`, { credentials: "include", cache: "no-store" }); const v = await r.json(); if (v.sesion) guardar("fk.yo", JSON.stringify({ t: Date.now(), v })); return v; }
    catch { return { sesion: false, caida: true }; }
  })());
  const entrarEn = (a) => `${a.url}/api/fungirak/entrar?volver=/`;
  const avatar = (y, t) => y.foto ? `<img src="${esc(y.foto)}" alt="" width="${t}" height="${t}">` : `<b>${esc(y.inicial || "?")}</b>`;

  const CSS = `:host{all:initial;display:inline-flex;align-items:center;gap:6px;font:500 14px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fk-tx,currentColor);position:relative;vertical-align:middle}
  *{box-sizing:border-box}button,a{font:inherit;color:inherit}
  .ic{width:40px;height:40px;border-radius:50%;border:0;background:transparent;display:grid;place-items:center;cursor:pointer;padding:0;transition:background .15s}
  .ic:hover,.ic[aria-expanded="true"]{background:color-mix(in srgb,currentColor 12%,transparent)}.ic:focus-visible{outline:2px solid #22E6FF;outline-offset:2px}
  .ic svg{width:22px;height:22px;fill:currentColor;opacity:.85}
  .av{width:34px;height:34px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:linear-gradient(135deg,#3CF2A0,#22E6FF);color:#06120c;font-weight:800}
  .av img{width:100%;height:100%;object-fit:cover}.av b{font-size:15px}
  .acc{display:inline-flex;gap:6px}.btn{border:0;border-radius:999px;padding:8px 14px;font-weight:700;cursor:pointer;text-decoration:none;white-space:nowrap}
  .btn.pri{background:#111;color:#fff}.btn.sec{background:color-mix(in srgb,currentColor 10%,transparent)}
  @media (prefers-color-scheme:dark){.btn.pri{background:#3CF2A0;color:#06120c}}
  .pan{position:absolute;top:calc(100% + 8px);right:0;z-index:2147483000;width:min(340px,calc(100vw - 16px));background:#fff;color:#15171c;border-radius:20px;
    box-shadow:0 12px 40px rgba(0,0,0,.25);padding:14px;max-height:min(520px,80vh);overflow:auto}
  @media (prefers-color-scheme:dark){.pan{background:#1b1e24;color:#eef0f3}}
  .pan[hidden]{display:none}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
  .ap{display:grid;justify-items:center;gap:4px;padding:10px 4px;border-radius:14px;text-decoration:none;text-align:center}.ap:hover,.ap:focus-visible{background:rgba(127,127,127,.14);outline:none}
  .ap img{width:46px;height:46px;border-radius:12px}.ap span{font-size:12px;font-weight:600;line-height:1.2}.ap small{font-size:11px;font-weight:700;color:#0f8a5f}
  @media (prefers-color-scheme:dark){.ap small{color:#3CF2A0}}
  .cab{display:flex;align-items:center;gap:10px;padding:4px 4px 12px;border-bottom:1px solid rgba(127,127,127,.25);margin-bottom:10px}
  .cab .av{width:44px;height:44px}.cab div{min-width:0}.cab b{display:block}.cab small{opacity:.7}
  .pie{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;border-top:1px solid rgba(127,127,127,.25);margin-top:10px;padding-top:10px;font-size:13px}
  .pie a{color:#0f8a5f;font-weight:700;text-decoration:none}@media (prefers-color-scheme:dark){.pie a{color:#3CF2A0}}
  .t{font-weight:800;font-size:15px;margin:2px 4px 10px}@media (max-width:560px){:host([modo="portal"]){gap:3px}:host([modo="portal"]) .ic{width:34px;height:34px}:host([modo="portal"]) .btn{padding:7px 11px;font-size:13px}}`;
  const GRILLA = `<svg viewBox="0 0 24 24" aria-hidden="true">${[4, 12, 20].flatMap((y) => [4, 12, 20].map((x) => `<circle cx="${x}" cy="${y}" r="2.2"/>`)).join("")}</svg>`;

  class FkBarra extends HTMLElement {
    static observedAttributes = ["local", "app", "entrar", "modo"];
    connectedCallback() {
      if (this.shadowRoot) return;
      this.attachShadow({ mode: "open" }).innerHTML = `<style>${CSS}</style><button class="ic" part="grilla" aria-label="Apps de FUNGIRAK" aria-haspopup="true" aria-expanded="false">${GRILLA}</button><span class="acc"></span><div class="pan" role="dialog" aria-label="Apps de FUNGIRAK" hidden></div>`;
      const b = this.shadowRoot.querySelector(".ic"), pan = this.shadowRoot.querySelector(".pan");
      b.addEventListener("click", () => this.abrir(pan.hidden ? "apps" : null));
      document.addEventListener("click", (e) => { if (!e.composedPath().includes(this)) this.abrir(null); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.abrir(null); });
      this.pintar();
    }
    attributeChangedCallback(_n, antes, ahora) { if (this.shadowRoot && antes !== ahora) this.pintar(); }
    // React 19 asigna estos datos como propiedades del elemento: cada uno se guarda como atributo (y redibuja si cambia).
    get app() { return this.getAttribute("app") || ""; }
    set app(v) { this.setAttribute("app", String(v ?? "")); }
    get entrar() { return this.getAttribute("entrar") || ""; }
    set entrar(v) { this.setAttribute("entrar", String(v ?? "")); }
    get local() { return this.getAttribute("local") || "0"; }
    set local(v) { this.setAttribute("local", String(v ?? "0")); }
    get modo() { return this.getAttribute("modo") || ""; }
    set modo(v) { this.setAttribute("modo", String(v ?? "")); }
    async pintar() {
      const y = await yo(); this.y = y;
      const acc = this.shadowRoot.querySelector(".acc");
      const portal = this.getAttribute("modo") === "portal";
      if (portal && y.caida) acc.innerHTML = ""; // la cuenta no responde: no ofrecer «Acceder» a una página caída
      else if (portal) acc.innerHTML = y.sesion
        ? `<button class="ic" aria-label="Tu cuenta FUNGIRAK: @${esc(y.usuario)}" aria-haspopup="true"><span class="av">${avatar(y, 34)}</span></button>`
        : `<a class="btn sec" href="${CUENTA}/entrar?volver=${encodeURIComponent(location.href)}">Acceder</a><a class="btn pri crear" href="${CUENTA}/crear?volver=${encodeURIComponent(location.href)}">Crear cuenta</a><style>@media (max-width: ${(parseInt(this.getAttribute("crear-desde"), 10) || 641) - 1}px) { .crear { display: none } }</style>`; // en pantallas angostas solo «Acceder» (crear está adentro); crear-desde="1500" lo sube en barras cargadas
      else acc.innerHTML = "";
      acc.querySelector("button")?.addEventListener("click", () => this.abrir(this.abierto === "yo" ? null : "yo"));
      acc.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => embudo(a.classList.contains("pri") ? "boton.crear" : "boton.acceder", this.app)));
      mejorarPie(y, this.app);
      if (!portal && y.sesion && this.getAttribute("local") !== "1") seguirComo(y, this);
      if (portal && !y.sesion && !y.caida) cartel(this.app);
    }
    abrir(que) {
      const pan = this.shadowRoot.querySelector(".pan"), b = this.shadowRoot.querySelector(".ic");
      this.abierto = que; pan.hidden = !que; b.setAttribute("aria-expanded", que === "apps" ? "true" : "false");
      if (!que) return;
      const y = this.y || { sesion: false }, usadas = new Set((y.apps || []).map((a) => a.id));
      if (que === "apps") {
        embudo("grilla.abierta", this.app);
        const orden = [...APPS.filter((a) => usadas.has(a.id)), ...APPS.filter((a) => !usadas.has(a.id))];
        pan.innerHTML = `<p class="t">${y.sesion ? "Tus apps" : "Apps de FUNGIRAK"}</p><div class="g">${orden.map((a) => `<a class="ap" data-id="${a.id}" href="${y.sesion ? entrarEn(a) : a.url}"><img src="${a.icono}" alt="" width="46" height="46" loading="lazy"><span>${esc(a.nombre)}</span>${y.sesion ? `<small>${usadas.has(a.id) ? "Abrir" : "Probar"}</small>` : ""}</a>`).join("")}</div>
          <div class="pie">${y.caida ? "" : y.sesion ? `<a href="${CUENTA}/">Administrar tu cuenta</a>` : `<a href="${CUENTA}/crear?volver=${encodeURIComponent(location.href)}">Crear cuenta FUNGIRAK</a><a href="${CUENTA}/entrar?volver=${encodeURIComponent(location.href)}">Acceder</a>`}<a href="https://fungirak.com">fungirak.com</a></div>`;
        pan.querySelectorAll(".ap").forEach((a) => a.addEventListener("click", () => embudo(y.sesion && !usadas.has(a.dataset.id) ? "grilla.probar" : "grilla.abrir", this.app)));
      } else {
        pan.innerHTML = `<div class="cab"><span class="av">${avatar(y, 44)}</span><div><b>${esc(y.nombre || "@" + y.usuario)}</b><small>@${esc(y.usuario)} · cuenta FUNGIRAK</small></div></div>
          <div class="pie" style="border:0;margin:0;padding:0"><a href="${CUENTA}/">Administrar tu cuenta</a><a href="#" data-salir>Salir</a></div>`;
        pan.querySelector("[data-salir]").addEventListener("click", async (e) => { e.preventDefault(); try { await fetch(`${CUENTA}/api/salir`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: "{}" }); } catch {} guardar("fk.yo", ""); location.reload(); });
      }
    }
  }
  customElements.define("fk-barra", FkBarra);

  // «Seguir como @gabi»: si tenés sesión FUNGIRAK y en esta app no, un toque y entrás (como Google One Tap). Se puede cerrar.
  function seguirComo(y, barra) {
    if (leer("fk.seguir.no") || document.getElementById("fk-seguir")) return;
    const a = APPS.find((x) => x.id === barra.app); if (!a) return;
    const entrar = barra.getAttribute("entrar") || "/api/fungirak/entrar";
    const h = document.createElement("div"); h.id = "fk-seguir";
    h.attachShadow({ mode: "open" }).innerHTML = `<style>:host{all:initial;position:fixed;right:16px;bottom:16px;z-index:2147483000;font:500 14px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
      .c{width:min(340px,calc(100vw - 32px));background:#fff;color:#15171c;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,.28);padding:16px;animation:e .3s ease}
      @media (prefers-color-scheme:dark){.c{background:#1b1e24;color:#eef0f3}}@keyframes e{from{transform:translateY(16px);opacity:0}}
      .f{display:flex;align-items:center;gap:12px}.av{width:44px;height:44px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:linear-gradient(135deg,#3CF2A0,#22E6FF);color:#06120c;font-weight:800;flex:none}
      .av img{width:100%;height:100%;object-fit:cover}small{opacity:.7;display:block}.x{margin-left:auto;align-self:flex-start;border:0;background:none;font-size:20px;cursor:pointer;color:inherit;opacity:.6}
      a.b{display:block;text-align:center;margin-top:12px;background:#111;color:#fff;border-radius:12px;padding:11px;font-weight:700;text-decoration:none}@media (prefers-color-scheme:dark){a.b{background:#3CF2A0;color:#06120c}}
      @media (prefers-reduced-motion:reduce){.c{animation:none}}</style>
      <div class="c" role="dialog" aria-label="Seguir con tu cuenta FUNGIRAK"><div class="f"><span class="av">${avatar(y, 44)}</span><div><b>Seguir como @${esc(y.usuario)}</b><small>con tu cuenta FUNGIRAK en ${esc(a.nombre)}</small></div><button class="x" aria-label="Cerrar">×</button></div>
      <a class="b" href="${esc(entrar)}?volver=${encodeURIComponent(location.pathname + location.search)}">Continuar</a></div>`;
    h.shadowRoot.querySelector(".x").addEventListener("click", () => { guardar("fk.seguir.no", "1"); h.remove(); });
    h.shadowRoot.querySelector("a").addEventListener("click", () => embudo("seguir.click", a.id));
    setTimeout(() => { document.body.appendChild(h); embudo("seguir.visto", a.id); }, 1200);
  }

  // Cartel suave en la portada: solo sin sesión, después de mirar un rato o bajar un poco; no vuelve por 7 días si lo cerrás.
  function cartel(app) {
    const hasta = Number(leer("fk.cartel", localStorage) || 0);
    if (Date.now() < hasta || document.getElementById("fk-cartel")) return;
    let listo = false;
    const mostrar = () => {
      if (listo) return; listo = true; window.removeEventListener("scroll", alBajar);
      const h = document.createElement("div"); h.id = "fk-cartel";
      h.attachShadow({ mode: "open" }).innerHTML = `<style>:host{all:initial;position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000;font:500 14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
        .c{width:min(560px,calc(100vw - 24px));background:#fff;color:#15171c;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,.28);padding:16px 18px;display:grid;gap:10px;animation:e .35s ease}
        @media (prefers-color-scheme:dark){.c{background:#1b1e24;color:#eef0f3}}@keyframes e{from{transform:translateY(20px);opacity:0}}
        .t{display:flex;gap:10px;align-items:flex-start}.t b{font-size:16px}.x{margin-left:auto;border:0;background:none;font-size:22px;cursor:pointer;color:inherit;opacity:.6}
        .i{display:flex;gap:6px;overflow:hidden}.i img{width:30px;height:30px;border-radius:8px;flex:none}
        .f{display:flex;gap:8px;flex-wrap:wrap}.f a{flex:1;min-width:140px;text-align:center;border-radius:12px;padding:10px;font-weight:700;text-decoration:none}
        .p{background:#111;color:#fff}.s{background:rgba(127,127,127,.15);color:inherit}@media (prefers-color-scheme:dark){.p{background:#3CF2A0;color:#06120c}}
        @media (prefers-reduced-motion:reduce){.c{animation:none}}</style>
        <div class="c" role="dialog" aria-label="Cuenta FUNGIRAK"><div class="t"><div><b>Una cuenta para todas las apps de FUNGIRAK</b><div style="opacity:.75">Entrás una vez y abrís cualquiera con un clic.</div></div><button class="x" aria-label="Cerrar">×</button></div>
        <div class="i" aria-hidden="true">${APPS.map((a) => `<img src="${a.icono}" alt="" width="30" height="30" loading="lazy">`).join("")}</div>
        <div class="f"><a class="p" href="${CUENTA}/crear?volver=${encodeURIComponent(location.href)}">Crear cuenta gratis</a><a class="s" href="${CUENTA}/entrar?volver=${encodeURIComponent(location.href)}">Ya tengo cuenta</a></div></div>`;
      h.shadowRoot.querySelector(".x").addEventListener("click", () => { guardar("fk.cartel", String(Date.now() + 7 * 864e5), localStorage); embudo("cartel.cerrado", app); h.remove(); });
      h.shadowRoot.querySelectorAll("a").forEach((x) => x.addEventListener("click", () => embudo("cartel.click", app)));
      document.body.appendChild(h); embudo("cartel.visto", app);
    };
    const alBajar = () => { if (window.scrollY > window.innerHeight * 0.9) mostrar(); };
    window.addEventListener("scroll", alBajar, { passive: true });
    setTimeout(mostrar, 15000);
  }

  // La franja «Más de FUNGIRAK» del pie: con sesión, cada app dice «Abrir» o «Probar» y entra con tu cuenta; sin sesión, invita a crearla.
  function mejorarPie(y, actual) {
    const rfk = document.querySelector(".rfk"); if (!rfk || rfk.dataset.fk) return;
    rfk.dataset.fk = "1";
    const usadas = new Set((y.apps || []).map((a) => a.id));
    if (y.sesion) {
      rfk.querySelectorAll("a.rfk-a").forEach((el) => {
        const a = APPS.find((x) => el.href.startsWith(x.url)); if (!a || a.id === actual) return;
        el.href = entrarEn(a);
        const i = el.querySelector(".rfk-tip i"); if (i) i.textContent = usadas.has(a.id) ? "Abrir →" : "Probar con tu cuenta →";
      });
    } else if (!y.caida) {
      const cab = rfk.querySelector(".rfk-cab"); if (!cab) return;
      const p = document.createElement("p");
      p.style.cssText = "margin:4px 0 0;font-size:13.5px;opacity:.85";
      p.innerHTML = `Con una sola cuenta FUNGIRAK entrás a todas. <a href="${CUENTA}/crear?volver=${encodeURIComponent(location.href)}" style="font-weight:800;text-decoration:underline">Crear cuenta gratis</a>`;
      cab.after(p);
    }
  }
})();
