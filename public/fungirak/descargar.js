/* FUNGIRAK · «Descargar todo»: las apps del Studio de una vez (mismo archivo en fungirak.com y en cuenta.fungirak.com).
   window.fkDescargar.abrir() abre la ventana con las apps en orden, por categoría y con casillas. En fungirak.com lleva a
   cuenta.fungirak.com/?descargar=1 con la ventana ya abierta (así hay una sola «FUNGIRAK Studio» instalable, la de la cuenta). Desde ahí:
   - «Instalar N»: instala cada app marcada sin salir de acá. El progreso queda en esta ventana; cada app se abre en una ventanita
     (compu) o pestaña (celu) solo para instalarse, con el asistente de cuenta.fungirak.com/fila.js a pantalla completa (tapa cookies y
     carteles de la app); al terminar avisa acá (postMessage) y se cierra sola. Cuando el navegador traiga navigator.install, se instala
     cada una directo desde acá. Aparte, «FUNGIRAK Studio»: este mismo sitio como una sola app con las marcadas.
   - «Descargar carpeta»: baja «FUNGIRAK Studio.zip», ordenada por categoría, con un acceso directo por app (y en Linux un
     instalar.sh que las suma al menú de aplicaciones); en el celu, una página por app y «FUNGIRAK Studio.html» con todas.
   Las marcadas quedan en localStorage (y en ?studio=…); si la app instalada no las sabe (p. ej. en el iPhone), muestra todas.
   Sin alertas nativas; Esc cierra. */
(() => {
  if (window.fkDescargar) return;
  // el cartel de instalar de Chrome/Edge/Android: se guarda para mostrarlo cuando toquen «Instalar» (si el layout no lo agarró antes)
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); window.__fkBip = e; });
  const K = "fk.studio", instalada = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const APPS = [["teamjoy", "Team Joy", "https://teamjoy.site", "apps", 900], ["dertin", "Dertin", "https://dertin.fungirak.com", "apps", 282], ["cronicas", "Las Crónicas de Fungi", "https://cronicasdefungi.fungirak.com", "juegos", 273], ["atlas", "Atlas Fit Pro", "https://atlasfit-pro.fungirak.com", "apps", 418], ["mitour", "MiTour", "https://mitour.fungirak.com", "apps", 255], ["atalaya", "Atalaya", "https://atalaya.fungirak.com", "apps", 618], ["musgui", "Musgui", "https://musgui.fungirak.com", "apps", 347], ["mate", "La Escuela del Mate", "https://escuela-del-mate.fungirak.com", "escuelas", 353], ["asador", "La Escuela del Asador", "https://escueladelasador.fungirak.com", "escuelas", 385], ["surco", "Surco", "https://surco.fungirak.com", "apps", 301], ["micoteca", "Micoteca", "https://micoteca.fungirak.com", "apps", 322], ["carta-al-futuro", "Carta al Futuro", "https://carta-al-futuro.fungirak.com", "apps", 257], ["hoy", "Hoy", "https://hoy.fungirak.com", "apps", 307], ["cv", "CV", "https://cv.fungirak.com", "herramientas", 305], ["preguntas", "Preguntas de a Dos", "https://preguntas.fungirak.com", "apps", 301], ["escanea", "Escaneá", "https://escanea.fungirak.com", "herramientas", 296], ["pasalo", "Pásalo", "https://pasalo.fungirak.com", "herramientas", 288], ["termometro", "Termómetro", "https://termometro.fungirak.com", "apps", 290], ["rinde", "Rinde", "https://rinde.fungirak.com", "apps", 289], ["que-hago-hoy", "Qué Hago Hoy", "https://que-hago-hoy.fungirak.com", "apps", 299], ["escuela-del-pescador", "La Escuela del Pescador", "https://escuela-del-pescador.fungirak.com", "escuelas", 296], ["escuela-de-mascotas", "La Escuela de las Mascotas", "https://escuela-de-mascotas.fungirak.com", "escuelas", 300], ["primeros-auxilios", "La Escuela de los Primeros Auxilios", "https://primeros-auxilios.fungirak.com", "escuelas", 292], ["trivia", "La Gran Trivia", "https://trivia.fungirak.com", "juegos", 285], ["figus", "Figus", "https://figus.fungirak.com", "juegos", 322], ["voluntarios", "Una Mano", "https://voluntarios.fungirak.com", "apps", 286], ["prode", "Prode", "https://prode.fungirak.com", "juegos", 286], ["afinados", "Afinados", "https://afinados.fungirak.com", "juegos", 286], ["santafe-oculta", "Santa Fe Oculta", "https://santafe-oculta.fungirak.com", "juegos", 285], ["fabrica", "Fábrica", "https://fabrica.fungirak.com", "apps", 283], ["ecos", "ECOS", "https://ecos-map.fungirak.com", "apps", 208]]; // [id, nombre, url, categoría, KB]
  const CATS = [["todas", "Todas"], ["apps", "Apps"], ["escuelas", "Escuelas"], ["herramientas", "Herramientas"], ["juegos", "Juegos"]];
  // Los íconos: en fungirak.com los suyos; en la cuenta, los de la cuenta (/apps/<id>.webp), así se leen sin pedir permiso a otro sitio.
  const ACA = location.hostname === "fungirak.com" || location.hostname === "localhost";
  const LOGO = (id) => (ACA ? `/img/logos/${id}.png` : `/apps/${id}.webp`), EXT = ACA ? "png" : "webp";
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const so = () => {
    const ua = navigator.userAgent, p = navigator.userAgentData?.platform || navigator.platform || "";
    if (/iPhone|iPad|iPod/.test(ua) || (p === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
    if (/Android/.test(ua)) return "android";
    if (/Win/.test(p)) return "windows";
    if (/Mac/.test(p)) return "mac";
    if (/Linux|X11/.test(p)) return "linux";
    return "otro";
  };
  const NOMBRE_SO = { ios: "tu iPhone", android: "tu Android", windows: "Windows", mac: "tu Mac", linux: "Linux", otro: "tu compu" };
  const mb = (kb) => (kb >= 1024 ? `${(kb / 1024).toFixed(1).replace(".", ",")} MB` : `${kb} KB`);

  // ——— ZIP sin compresión (los accesos directos pesan casi nada) ———
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = (b) => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const ahora = new Date(), FECHA = [(ahora.getHours() << 11) | (ahora.getMinutes() << 5), ((ahora.getFullYear() - 1980) << 9) | ((ahora.getMonth() + 1) << 5) | ahora.getDate()];
  function zip(archivos) {
    const te = new TextEncoder(), partes = [], centro = []; let off = 0;
    for (const [nombre, dato, ejecutable] of archivos) {
      const n = te.encode(nombre), d = typeof dato === "string" ? te.encode(dato) : dato, c = crc32(d);
      const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
      h.setUint16(10, FECHA[0], true); h.setUint16(12, FECHA[1], true); h.setUint32(14, c, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, n.length, true);
      partes.push(new Uint8Array(h.buffer), n, d);
      const z = new DataView(new ArrayBuffer(46)); z.setUint32(0, 0x02014b50, true); z.setUint16(4, 0x0314, true); z.setUint16(6, 20, true); z.setUint16(8, 0x0800, true);
      z.setUint16(12, FECHA[0], true); z.setUint16(14, FECHA[1], true); z.setUint32(16, c, true); z.setUint32(20, d.length, true); z.setUint32(24, d.length, true); z.setUint16(28, n.length, true);
      z.setUint32(38, ((ejecutable ? 0o100755 : 0o100644) << 16) >>> 0, true); z.setUint32(42, off, true);
      centro.push(new Uint8Array(z.buffer), n); off += 30 + n.length + d.length;
    }
    const tam = centro.reduce((s, x) => s + x.length, 0), f = new DataView(new ArrayBuffer(22));
    f.setUint32(0, 0x06054b50, true); f.setUint16(8, archivos.length, true); f.setUint16(10, archivos.length, true); f.setUint32(12, tam, true); f.setUint32(16, off, true);
    return new Blob([...partes, ...centro, new Uint8Array(f.buffer)], { type: "application/zip" });
  }
  const limpio = (t) => t.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim();
  const NOMBRE_CAT = Object.fromEntries(CATS);
  // una página que abre la app al tocarla (Android y iPhone abren los .html de la carpeta con el navegador)
  const pagina = (nombre, url, icono) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(nombre)}</title><meta http-equiv="refresh" content="0;url=${url}/"></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;font:600 18px system-ui,sans-serif;background:#f4f4f2;color:#16181d"><a href="${url}/" style="display:grid;justify-items:center;gap:12px;color:inherit;text-decoration:none">${icono ? `<img src="${icono}" alt="" width="96" height="96" style="border-radius:22px">` : ""}Abrir ${esc(nombre)}</a></body></html>\n`;
  async function carpeta(lista, sistema) {
    const D = "FUNGIRAK Studio/", A = [], movil = sistema === "ios" || sistema === "android";
    const sub = (cat) => `${D}${NOMBRE_CAT[cat] || "Apps"}/`;
    const iconos = await Promise.all(lista.map(async ([id]) => { try { const r = await fetch(LOGO(id), { mode: "cors" }); return r.ok ? new Uint8Array(await r.arrayBuffer()) : null; } catch { return null; } }));
    lista.forEach(([id, nombre, url, cat], i) => {
      const n = limpio(nombre), S = sub(cat);
      if (iconos[i] && (movil || (sistema !== "windows" && sistema !== "mac"))) A.push([`${D}iconos/${id}.${EXT}`, iconos[i]]);
      if (movil) A.push([`${S}${n}.html`, pagina(nombre, url, iconos[i] ? `../iconos/${id}.${EXT}` : "")]);
      else if (sistema === "windows") A.push([`${S}${n}.url`, `[InternetShortcut]\r\nURL=${url}/\r\nIconFile=${url}/favicon.ico\r\nIconIndex=0\r\n`]);
      else if (sistema === "mac") A.push([`${S}${n}.webloc`, `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>URL</key><string>${url}/</string></dict></plist>\n`]);
      else {
        A.push([`${S}${n}.desktop`, `[Desktop Entry]\nVersion=1.0\nType=Link\nName=${nombre}\nComment=${nombre}, de FUNGIRAK Studio\nURL=${url}/\nIcon=CARPETA/iconos/${id}.${EXT}\n`, true]);
      }
    });
    if (movil) {
      const i = (id) => (iconos[lista.findIndex((a) => a[0] === id)] ? `iconos/${id}.${EXT}` : "");
      A.push([`${D}FUNGIRAK Studio.html`, `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FUNGIRAK Studio</title></head>
<body style="margin:0;padding:20px 16px 40px;font:500 15px system-ui,sans-serif;background:#f4f4f2;color:#16181d"><h1 style="font-size:24px;margin:0 0 4px">FUNGIRAK Studio</h1><p style="margin:0 0 8px;opacity:.7">Tocá una app para abrirla. Una sola cuenta para todas: cuenta.fungirak.com</p>
${CATS.slice(1).map(([k, t]) => { const l = lista.filter((a) => a[3] === k); return l.length ? `<h2 style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;opacity:.6;margin:22px 0 8px">${t}</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:14px">${l.map(([id, nombre, url]) => `<a href="${url}/" style="display:grid;justify-items:center;gap:6px;text-align:center;color:inherit;text-decoration:none;font-size:12.5px;font-weight:650">${i(id) ? `<img src="${i(id)}" alt="" width="60" height="60" style="border-radius:15px">` : ""}${esc(nombre)}</a>`).join("")}</div>` : ""; }).join("")}
</body></html>\n`]);
    }
    if (!movil && sistema !== "windows" && sistema !== "mac") {
      A.push([`${D}instalar.sh`, `#!/bin/sh\n# Suma las apps de FUNGIRAK Studio al menú de aplicaciones (y les pone el ícono). Correlo con: sh instalar.sh\nC="$(cd "$(dirname "$0")" && pwd)"; M="$HOME/.local/share/applications"; mkdir -p "$M"\nfind "$C" -name '*.desktop' | while IFS= read -r f; do sed "s|CARPETA|$C|" "$f" > "$M/fungirak-$(basename "$f" | tr ' ' '-')"; sed -i "s|CARPETA|$C|" "$f"; done\necho "Listo: las apps de FUNGIRAK Studio ya están en tu menú de aplicaciones."\n`, true]);
    }
    A.push([`${D}LEEME.txt`, `FUNGIRAK Studio: ${lista.length} apps\n\n${sistema === "linux" || sistema === "otro" ? "Para sumarlas al menú de aplicaciones: abrí una terminal en esta carpeta y corré  sh instalar.sh\n\n" : ""}${movil ? "Abrí «FUNGIRAK Studio.html» para ver todas juntas, o tocá cualquier app dentro de su carpeta. Para tenerla como app de verdad, abrila y tocá «Instalar» (en iPhone: Compartir → «Agregar a inicio»)." : "Cada acceso directo abre su app en el navegador. Para tenerla como app de verdad, abrila y tocá «Instalar»."}\nUna sola cuenta FUNGIRAK para todas: https://cuenta.fungirak.com\n\n${lista.map(([, nombre, url]) => `· ${nombre}: ${url}`).join("\n")}\n`]);
    return zip(A);
  }

  // ——— Instalar una por una sin salir de acá: el progreso queda en esta ventana ———
  const b64 = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  function fila(lista, v, cerrar, sistema) {
    if (typeof navigator.install === "function") return instalar(lista, v, cerrar, sistema); // el navegador ya instala apps de otros sitios desde acá
    const movil = sistema === "ios" || sistema === "android", est = Object.fromEntries(lista.map((a) => [a[0], "pendiente"]));
    let i = 0, w = null, vigia = null;
    const ICO = { pendiente: "○", abierta: "⏳", cerrada: "⚠️", ok: "✅", saltada: "⏭" };
    const actual = () => lista[i];
    const avanzar = (estado) => { const a = actual(); if (!a) return; est[a[0]] = estado; clearInterval(vigia); i++; pintarF(); };
    const abrirApp = () => {
      const [id, nombre, url] = actual();
      // ?fkinst: el asistente nuevo (fila.js); ?fkcola de una sola app: el de las apps que todavía tienen la fila vieja en fk.js
      const u = id === "teamjoy" ? `${url}/` : `${url}/?fkinst=1&fkcola=${b64({ c: [[url, nombre, id]], v: location.origin + "/" })}&fkpaso=0`;
      w = window.open(u, "fkinst", movil ? "" : `popup,width=460,height=700,left=${Math.max(0, screenX + outerWidth - 520)},top=${screenY + 70}`);
      est[id] = "abierta"; pintarF();
      clearInterval(vigia);
      vigia = setInterval(() => { if (!w || w.closed) { clearInterval(vigia); if (est[id] === "abierta") { est[id] = "cerrada"; pintarF(); } } }, 800);
    };
    const oir = (e) => {
      const d = e.data; if (!d || d.fk !== "fila") return;
      if (e.origin !== location.origin && !lista.some((a) => e.origin === new URL(a[2]).origin)) return;
      if (actual() && ["abierta", "cerrada"].includes(est[actual()[0]])) avanzar(d.ok ? "ok" : "saltada");
    };
    addEventListener("message", oir);
    const listo = () => { removeEventListener("message", oir); clearInterval(vigia); cerrar(); };
    function pintarF() {
      const hechas = lista.filter((a) => est[a[0]] === "ok").length, pasadas = lista.filter((a) => ["ok", "saltada"].includes(est[a[0]])).length;
      const a = actual(), e = a && est[a[0]];
      const pie = !a
        ? `<p class="nota"><b>✅ Listo: instalaste ${hechas} de ${lista.length}.</b> ${movil ? "Las tenés en tu pantalla de inicio: para agruparlas, mantené apretada una y arrastrala sobre otra." : "Las encontrás en tu escritorio o en el menú de aplicaciones."}</p><div class="bs"><button class="si" data-g="fin">Listo</button></div>`
        : e === "abierta"
          ? `<p class="nota">${a[0] === "teamjoy" ? `Se abrió <b>Team Joy</b>: tocá su botón «Instalar». Después cerrá esa ${movil ? "pestaña" : "ventanita"} y tocá «Ya la instalé».` : `Se abrió <b>${esc(a[1])}</b> en una ${movil ? "pestaña" : "ventanita"}: tocá «Instalar» ahí. Cuando termine se cierra sola y seguimos acá.`}</p><div class="bs"><button class="no" data-g="saltar">Saltear</button><button class="alt" data-g="ya">Ya la instalé</button><button class="si" data-g="abrir">Abrir de nuevo</button></div>`
          : e === "cerrada"
            ? `<p class="nota">Se cerró la ${movil ? "pestaña" : "ventanita"} de <b>${esc(a[1])}</b>. ¿La instalaste?</p><div class="bs"><button class="no" data-g="saltar">Saltear</button><button class="alt" data-g="abrir">Reintentar</button><button class="si" data-g="ya">Sí, seguir</button></div>`
            : `<p class="nota">${pasadas ? "" : `Cada app se abre en una ${movil ? "pestaña" : "ventanita"} solo para instalarse y se cierra sola: vos seguís acá. `}${sistema === "ios" ? "En el iPhone, en cada una: Compartir → «Agregar a inicio»." : ""}</p><div class="bs"><button class="no" data-g="fin">Terminar</button><button class="alt" data-g="saltar">Saltear</button><button class="si" data-g="abrir">Instalar ${esc(a[1])}</button></div>`;
      v.innerHTML = `<button class="x" aria-label="Cerrar">✕</button><div class="cab"><b>Instalando tus apps</b><small>${pasadas} de ${lista.length} · ${hechas} instaladas</small></div>
        <div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="${lista.length}" aria-valuenow="${pasadas}"><i style="width:${Math.round((pasadas / lista.length) * 100)}%"></i></div>
        <div class="lista">${lista.map(([id, nombre], k) => `<label class="${k === i ? "act" : ""}"><span class="ico">${ICO[est[id]]}</span><img src="${LOGO(id)}" alt="" width="44" height="44" loading="lazy"><span><b>${esc(nombre)}</b><small>${{ pendiente: k === i ? "Sigue esta" : "Pendiente", abierta: "Instalando…", cerrada: "Sin confirmar", ok: "Instalada", saltada: "Salteada" }[est[id]]}</small></span><span></span></label>`).join("")}</div>
        <div class="pie">${pie}</div>`;
      v.querySelector(".x").onclick = listo;
      const g = (k) => v.querySelector(`[data-g=${k}]`);
      g("abrir") && (g("abrir").onclick = abrirApp);
      g("saltar") && (g("saltar").onclick = () => { try { w?.close(); } catch {} avanzar("saltada"); });
      g("ya") && (g("ya").onclick = () => { try { w?.close(); } catch {} avanzar("ok"); });
      g("fin") && (g("fin").onclick = listo);
      v.querySelector("label.act")?.scrollIntoView({ block: "nearest" });
    }
    pintarF();
  }

  // ——— FUNGIRAK Studio: este mismo sitio como una sola app con las marcadas ———
  async function instalar(lista, v, cerrar, sistema) {
    const ids = lista.map((a) => a[0]).join(",");
    try { localStorage.setItem(K, ids); } catch {}
    const u = new URL(location.href); u.searchParams.set("studio", ids); history.replaceState(history.state, "", u); // así la app instalada sabe cuáles
    const fin = (html, extra = "") => { v.innerHTML = `<div class="ok">${html}<div class="bs">${extra}<button class="no" data-f="1">Listo</button></div></div>`; v.querySelector("[data-f='1']").onclick = cerrar; };
    if (typeof navigator.install === "function") { // instalar cada app por separado, acá mismo (un toque por app: el navegador lo pide así)
      v.innerHTML = `<div class="cab"><b>Instalá cada una sin salir de acá</b><small>Tocá «Instalar» en cada app: se instala sola y seguís acá.</small></div><div class="lista">${lista.map(([id, nombre, url]) =>
        `<label><span></span><img src="${LOGO(id)}" alt="" width="44" height="44"><span><b>${esc(nombre)}</b></span><button class="alt mini" data-u="${url}/">Instalar</button></label>`).join("")}</div><div class="pie"><div class="bs"><button class="no" data-f="1">Listo</button></div></div>`;
      v.querySelector("[data-f='1']").onclick = cerrar;
      v.querySelectorAll("[data-u]").forEach((b) => (b.onclick = async (e) => { e.preventDefault(); try { await navigator.install(b.dataset.u); b.textContent = "✓ Instalada"; } catch { b.textContent = "No se pudo"; } b.disabled = true; }));
      return;
    }
    if (instalada()) { cerrar(); return lanzador(); } // ya estás adentro de la app: se actualiza la lista
    const bip = window.__fkBip;
    if (bip) {
      bip.prompt();
      const { outcome } = await bip.userChoice.catch(() => ({ outcome: "dismissed" }));
      window.__fkBip = null;
      return outcome === "accepted"
        ? fin(`<b>✅ Listo: instalaste FUNGIRAK Studio</b><p>Abrila desde ${sistema === "android" ? "tu pantalla de inicio" : "tu escritorio o el menú de aplicaciones"}: ahí están tus ${lista.length} apps, ordenadas por categoría. Cada una se abre con un toque.</p>`)
        : fin(`<b>No se instaló</b><p>Podés volver a intentarlo cuando quieras, o bajar la carpeta con un acceso directo a cada app.</p>`);
    }
    if (sistema === "ios") return fin(`<b>Un paso más, sin salir de acá</b><p>En el iPhone, Apple no deja que los sitios muestren el botón de instalar. Tocá <b>Compartir</b> (el cuadradito con la flecha, abajo) y después <b>«Agregar a inicio»</b>. Al abrir FUNGIRAK Studio desde tu inicio vas a ver tus ${lista.length} apps.</p>`);
    return fin(`<b>Tu navegador no ofrece instalar desde acá</b><p>Puede que ya tengas FUNGIRAK Studio instalada: buscala en ${sistema === "android" ? "tu pantalla de inicio" : "tu escritorio o el menú de aplicaciones"}. Si no, buscá «Instalar» en el menú del navegador (⋮), o bajá la carpeta con un acceso directo a cada app.</p>`);
  }

  // ——— FUNGIRAK Studio instalada: al abrirla, las apps marcadas, por categoría (cada una se abre aparte, la lista queda) ———
  function lanzador() {
    let ids = new URLSearchParams(location.search).get("studio");
    try { if (ids) localStorage.setItem(K, ids); else ids = localStorage.getItem(K); } catch {}
    const marcadas = APPS.filter((a) => (ids || "").split(",").includes(a[0])), lista = marcadas.length ? marcadas : APPS; // sin elegidas: todas
    if (document.querySelector("fk-studio")) return;
    const h = document.createElement("fk-studio"), r = h.attachShadow({ mode: "open" });
    if (document.documentElement.dataset.theme === "dark" || document.documentElement.dataset.tema === "oscuro" || (!document.documentElement.dataset.theme && !document.documentElement.dataset.tema && matchMedia("(prefers-color-scheme: dark)").matches)) h.setAttribute("oscuro", "");
    r.innerHTML = `<style>${CSS}
:host{inset:0}.st{position:absolute;inset:0;overflow-y:auto;background:#f4f4f2;padding:22px 16px calc(28px + env(safe-area-inset-bottom))}:host([oscuro]) .st{background:#121418}
.st h1{margin:0;font-size:24px;font-weight:850}.st p{margin:4px 0 0;opacity:.7}.gr{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:16px 10px;max-width:900px}
.gr a{display:grid;justify-items:center;gap:7px;text-align:center;color:inherit;text-decoration:none;font-size:12.5px;font-weight:700;line-height:1.2}.gr img{width:62px;height:62px;border-radius:16px;box-shadow:0 3px 10px rgba(0,0,0,.18)}
.st .g{margin:22px 2px 10px}.st .bs{margin-top:28px;max-width:520px}</style>
      <div class="st"><h1>FUNGIRAK Studio</h1><p>Tus ${lista.length} apps. Tocá una para abrirla.</p>
      ${CATS.slice(1).map(([k, t]) => { const l = lista.filter((a) => a[3] === k); return l.length ? `<p class="g">${t} · ${l.length}</p><div class="gr">${l.map(([id, nombre, url]) => `<a href="${url}/" target="_blank" rel="noopener"><img src="${LOGO(id)}" alt="" width="62" height="62">${esc(nombre)}</a>`).join("")}</div>` : ""; }).join("")}
      <div class="bs"><button class="alt" data-s="elegir">Elegir apps</button><button class="no" data-s="sitio">Ver ${esc(location.hostname)}</button></div></div>`;
    r.querySelector("[data-s=sitio]").onclick = () => h.remove();
    r.querySelector("[data-s=elegir]").onclick = () => { h.remove(); abrir(); };
    document.body.appendChild(h);
  }

  const CSS = `
:host{all:initial;position:fixed;inset:0;z-index:2147483646;font:500 15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#16181d}
.velo{position:absolute;inset:0;background:rgba(8,10,14,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:ap .2s ease}
.v{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,calc(100vw - 20px));max-height:min(860px,calc(100dvh - 20px));display:flex;flex-direction:column;
  background:#fff;border-radius:24px;box-shadow:0 30px 80px rgba(0,0,0,.45);overflow:hidden;animation:sube .3s cubic-bezier(.2,1.1,.4,1)}
:host([oscuro]){color:#eef0f3}:host([oscuro]) .v{background:#1b1e24}
.cab{padding:20px 20px 10px;display:grid;gap:4px}.cab b{font-size:21px;font-weight:850;letter-spacing:-.01em}.cab small{opacity:.72}
.x{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;border:0;background:rgba(127,127,127,.14);color:inherit;font-size:18px;cursor:pointer}
.cab,.tabs,.tod,.pie{flex:none}.tabs{display:flex;gap:6px;padding:4px 20px 10px;overflow-x:auto;scrollbar-width:none}.tabs::-webkit-scrollbar{display:none}
.tabs button{flex:none;border:1.5px solid rgba(127,127,127,.3);background:none;color:inherit;font:inherit;font-weight:700;font-size:13.5px;padding:7px 13px;border-radius:999px;cursor:pointer}
.tabs button[aria-pressed=true]{background:#3CF2A0;color:#06120c;border-color:transparent}
.tod{display:flex;align-items:center;justify-content:space-between;padding:0 20px 8px;font-size:13.5px}
.tod button{border:0;background:none;color:#0b8f5a;font:inherit;font-weight:800;cursor:pointer;padding:4px 0}:host([oscuro]) .tod button{color:#3CF2A0}
.lista{flex:1;overflow-y:auto;padding:0 12px 8px;scrollbar-width:thin;scrollbar-color:#3CF2A0 transparent}.lista::-webkit-scrollbar{width:6px}.lista::-webkit-scrollbar-thumb{background:#3CF2A0;border-radius:6px}
.g{margin:10px 8px 4px;font-size:11.5px;font-weight:850;letter-spacing:.12em;text-transform:uppercase;opacity:.6}
label{display:grid;grid-template-columns:auto 44px 1fr auto;align-items:center;gap:12px;padding:8px;border-radius:14px;cursor:pointer}
label:hover{background:rgba(127,127,127,.08)}label img{width:44px;height:44px;border-radius:11px;box-shadow:0 2px 8px rgba(0,0,0,.18)}
label b{display:block;font-weight:750;font-size:14.5px;line-height:1.2}label small{font-size:12px;opacity:.6}label .kb{font-size:12px;opacity:.6;white-space:nowrap}
input[type=checkbox]{width:20px;height:20px;accent-color:#16a36a;margin:0}
.pie{border-top:1px solid rgba(127,127,127,.2);padding:14px 20px calc(16px + env(safe-area-inset-bottom));display:grid;gap:10px}
.tot{display:flex;justify-content:space-between;font-size:13.5px}.tot b{font-weight:800}
.bs{display:flex;gap:8px;flex-wrap:wrap}.bs button{flex:1 1 140px;min-height:48px;border-radius:14px;font:inherit;font-weight:800;cursor:pointer;border:0}
.no{background:rgba(127,127,127,.15);color:inherit}.si{background:#111;color:#fff}:host([oscuro]) .si{background:#3CF2A0;color:#06120c}
.si[disabled]{opacity:.45;cursor:not-allowed}.alt{background:none;border:1.5px solid rgba(127,127,127,.35)!important;color:inherit}.alt[disabled]{opacity:.45;cursor:not-allowed}
.mini{min-height:36px;padding:0 14px;border-radius:12px;font:inherit;font-weight:800;cursor:pointer}
.prog{flex:none;height:8px;margin:0 20px 10px;border-radius:8px;background:rgba(127,127,127,.18);overflow:hidden}.prog i{display:block;height:100%;background:#3CF2A0;transition:width .4s ease}
label.act{background:rgba(60,242,160,.14)}.ico{width:20px;text-align:center;font-size:15px}
.enl{border:0;background:none;color:#0b8f5a;font:inherit;font-weight:800;cursor:pointer;padding:0;text-decoration:underline}:host([oscuro]) .enl{color:#3CF2A0}
.nota{font-size:12.5px;opacity:.72;margin:0}
.ok{padding:28px 22px 24px;display:grid;gap:12px;text-align:center}.ok b{font-size:20px}.ok p{margin:0;opacity:.8}
@keyframes ap{from{opacity:0}}@keyframes sube{from{opacity:0;transform:translate(-50%,-46%) scale(.97)}}
@media (prefers-reduced-motion:reduce){.velo,.v{animation:none}}`;

  function abrir() {
    if (location.hostname === "fungirak.com") { location.href = "https://cuenta.fungirak.com/?descargar=1"; return; }
    if (document.querySelector("fk-descargar")) return;
    const sistema = so(), movil = sistema === "ios" || sistema === "android";
    const h = document.createElement("fk-descargar");
    const oscuro = document.documentElement.dataset.theme === "dark" || document.documentElement.dataset.tema === "oscuro" || (!document.documentElement.dataset.theme && !document.documentElement.dataset.tema && matchMedia("(prefers-color-scheme: dark)").matches);
    if (oscuro) h.setAttribute("oscuro", "");
    const r = h.attachShadow({ mode: "open" });
    let cat = "todas";
    const marcadas = new Set(APPS.map((a) => a[0]));
    const cerrar = () => { h.remove(); removeEventListener("keydown", tecla); document.documentElement.style.overflow = ""; };
    const tecla = (e) => { if (e.key === "Escape") cerrar(); };
    const pintar = () => {
      const vis = APPS.filter((a) => cat === "todas" || a[3] === cat);
      const elegidas = APPS.filter((a) => marcadas.has(a[0]));
      const kb = elegidas.reduce((s, a) => s + a[4], 0);
      const grupos = cat === "todas" ? CATS.slice(1).map(([k, t]) => [t, vis.filter((a) => a[3] === k)]) : [[null, vis]];
      r.innerHTML = `<style>${CSS}</style><div class="velo"></div>
      <div class="v" role="dialog" aria-modal="true" aria-labelledby="t">
        <button class="x" aria-label="Cerrar">✕</button>
        <div class="cab"><b id="t">⬇ Descargar todo</b><small>Las ${APPS.length} apps de FUNGIRAK Studio, de una vez. Marcá las que quieras.</small></div>
        <div class="tabs" role="tablist">${CATS.map(([k, t]) => `<button data-cat="${k}" aria-pressed="${k === cat}">${t}</button>`).join("")}</div>
        <div class="tod"><span>${elegidas.length} de ${APPS.length} elegidas</span><span><button data-todas="1">Marcar ${cat === "todas" ? "todas" : "estas"}</button> · <button data-todas="0">Ninguna</button></span></div>
        <div class="lista">${grupos.map(([t, l]) => (t ? `<p class="g">${t} · ${l.length}</p>` : "") + l.map(([id, nombre, url, , kbs]) =>
          `<label><input type="checkbox" data-id="${id}" ${marcadas.has(id) ? "checked" : ""}><img src="${LOGO(id)}" alt="" width="44" height="44" loading="lazy"><span><b>${esc(nombre)}</b><small>${esc(url.replace("https://", ""))}</small></span><span class="kb">${mb(kbs)}</span></label>`).join("")).join("")}</div>
        <div class="pie">
          <div class="tot"><span>Para ${NOMBRE_SO[sistema]}</span><span>Total: <b>${mb(kb)}</b></span></div>
          <p class="nota">Sin salir de acá: «Instalar» instala cada app marcada, una por una, y ves el progreso en esta ventana. «Descargar carpeta» baja un acceso directo a cada una. ¿Preferís una sola app con todas? <button class="enl" data-ac="studio">Instalá FUNGIRAK Studio</button>.</p>
          <div class="bs"><button class="no" data-ac="cancelar">Cancelar</button><button class="alt" data-ac="carpeta" ${elegidas.length ? "" : "disabled"}>Descargar carpeta</button><button class="si" data-ac="ir" ${elegidas.length ? "" : "disabled"}>Instalar ${elegidas.length}</button></div>
        </div>
      </div>`;
      r.querySelector(".x").onclick = cerrar; r.querySelector(".velo").onclick = cerrar;
      r.querySelectorAll("[data-cat]").forEach((b) => (b.onclick = () => { cat = b.dataset.cat; pintar(); }));
      r.querySelectorAll("[data-todas]").forEach((b) => (b.onclick = () => { for (const a of vis) b.dataset.todas === "1" ? marcadas.add(a[0]) : marcadas.delete(a[0]); pintar(); }));
      r.querySelectorAll("input[data-id]").forEach((c) => (c.onchange = () => { c.checked ? marcadas.add(c.dataset.id) : marcadas.delete(c.dataset.id); const y = r.querySelector(".lista").scrollTop; pintar(); r.querySelector(".lista").scrollTop = y; }));
      r.querySelector("[data-ac=cancelar]").onclick = cerrar;
      const lista = () => APPS.filter((a) => marcadas.has(a[0]));
      r.querySelector("[data-ac=ir]").onclick = () => fila(lista(), r.querySelector(".v"), cerrar, sistema);
      r.querySelector("[data-ac=studio]").onclick = () => instalar(lista(), r.querySelector(".v"), cerrar, sistema);
      r.querySelector("[data-ac=carpeta]").onclick = async (e) => {
        e.target.disabled = true; e.target.textContent = "Armando la carpeta…";
        const blob = await carpeta(lista(), sistema);
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "FUNGIRAK Studio.zip"; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 60000);
        r.querySelector(".v").innerHTML = `<div class="ok"><b>✅ Listo: «FUNGIRAK Studio.zip»</b><p>${movil ? `Abrilo desde «Archivos» (o «Descargas»): se descomprime y te queda la carpeta con ${lista().length} apps ordenadas por categoría. Adentro, «FUNGIRAK Studio.html» las muestra todas juntas.` : `Descomprimilo donde quieras y te queda la carpeta con ${lista().length} apps, ordenadas por categoría.`}${sistema === "linux" || sistema === "otro" ? " Para sumarlas al menú de aplicaciones, corré <b>sh instalar.sh</b> adentro de la carpeta." : ""}</p><div class="bs"><button class="no" data-f="1">Volver</button><button class="si" data-f="2">Instalarlas</button></div></div>`;
        r.querySelector("[data-f='1']").onclick = cerrar; r.querySelector("[data-f='2']").onclick = () => fila(lista(), r.querySelector(".v"), cerrar, sistema);
      };
    };
    pintar();
    document.body.appendChild(h); document.documentElement.style.overflow = "hidden"; addEventListener("keydown", tecla);
  }
  window.fkDescargar = { abrir, apps: APPS };
  if (instalada()) lanzador(); // abriste FUNGIRAK Studio desde el escritorio o el inicio
  // la ventanita de una app terminó (fila vieja de fk.js: vuelve acá con ?fklisto=N): avisar a la ventana del progreso y cerrarse
  { const p = new URLSearchParams(location.search); if (p.has("fklisto") && window.opener) { try { window.opener.postMessage({ fk: "fila", ok: p.get("fklisto") !== "0" }, location.origin); } catch {} window.close(); } }
  // viene del botón de fungirak.com: la ventana ya abierta
  if (new URLSearchParams(location.search).has("descargar")) { const u = new URL(location.href); u.searchParams.delete("descargar"); history.replaceState(history.state, "", u); abrir(); }
  // cualquier botón con data-fk-descargar la abre (así sirve también en páginas sin React, como la barra de la cuenta)
  document.addEventListener("click", (e) => { if (e.target.closest?.("[data-fk-descargar]")) { e.preventDefault(); abrir(); } });
})();
