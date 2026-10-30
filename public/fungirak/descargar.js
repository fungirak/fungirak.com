/* FUNGIRAK · «Descargar todo»: las apps del Studio de una vez (mismo archivo en fungirak.com y en cuenta.fungirak.com).
   window.fkDescargar.abrir() abre la ventana con las 31 apps en orden (de la más importante a la menos), por categoría y con casillas.
   - Compu (Windows, Mac, Linux): baja «FUNGIRAK Studio.zip», una carpeta con un acceso directo por app (y en Linux un
     instalar.sh que las suma al menú de aplicaciones). También ofrece instalarlas como apps, una tras otra.
   - Celu (Android, iPhone): el navegador no deja instalar otras apps desde acá, así que arma una «fila de instalación»: abre cada
     app con su cartel de instalar listo y al instalar (o saltear) pasa sola a la siguiente (eso lo hace /fungirak/fk.js de cada app).
   Sin alertas nativas; Esc cierra. */
(() => {
  if (window.fkDescargar) return;
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
  async function carpeta(lista, sistema) {
    const D = "FUNGIRAK Studio/", A = [];
    const iconos = await Promise.all(lista.map(async ([id]) => { try { const r = await fetch(LOGO(id), { mode: "cors" }); return r.ok ? new Uint8Array(await r.arrayBuffer()) : null; } catch { return null; } }));
    lista.forEach(([id, nombre, url], i) => {
      const n = limpio(nombre);
      if (sistema === "windows") A.push([`${D}${n}.url`, `[InternetShortcut]\r\nURL=${url}/\r\nIconFile=${url}/favicon.ico\r\nIconIndex=0\r\n`]);
      else if (sistema === "mac") A.push([`${D}${n}.webloc`, `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>URL</key><string>${url}/</string></dict></plist>\n`]);
      else {
        if (iconos[i]) A.push([`${D}iconos/${id}.${EXT}`, iconos[i]]);
        A.push([`${D}${n}.desktop`, `[Desktop Entry]\nVersion=1.0\nType=Link\nName=${nombre}\nComment=${nombre}, de FUNGIRAK Studio\nURL=${url}/\nIcon=CARPETA/iconos/${id}.${EXT}\n`, true]);
      }
    });
    if (sistema !== "windows" && sistema !== "mac") {
      A.push([`${D}instalar.sh`, `#!/bin/sh\n# Suma las apps de FUNGIRAK Studio al menú de aplicaciones (y les pone el ícono). Correlo con: sh instalar.sh\nC="$(cd "$(dirname "$0")" && pwd)"; M="$HOME/.local/share/applications"; mkdir -p "$M"\nfor f in "$C"/*.desktop; do sed "s|CARPETA|$C|" "$f" > "$M/fungirak-$(basename "$f" | tr ' ' '-')"; sed -i "s|CARPETA|$C|" "$f"; done\necho "Listo: las apps de FUNGIRAK Studio ya están en tu menú de aplicaciones."\n`, true]);
    }
    A.push([`${D}LEEME.txt`, `FUNGIRAK Studio: ${lista.length} apps\n\n${sistema === "linux" || sistema === "otro" ? "Para sumarlas al menú de aplicaciones: abrí una terminal en esta carpeta y corré  sh instalar.sh\n\n" : ""}Cada acceso directo abre su app en el navegador. Para tenerla como app de verdad, abrila y tocá «Instalar».\nUna sola cuenta FUNGIRAK para todas: https://cuenta.fungirak.com\n\n${lista.map(([, nombre, url]) => `· ${nombre}: ${url}`).join("\n")}\n`]);
    return zip(A);
  }

  // ——— La fila de instalación: arranca en la primera app; fk.js de cada app muestra el cartel y pasa a la siguiente ———
  const b64 = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  function fila(lista) {
    // Team Joy (teamjoy.site) no tiene el cartel de la fila: va última, y ahí se instala con su propio botón.
    const orden = [...lista.filter((a) => a[0] !== "teamjoy"), ...lista.filter((a) => a[0] === "teamjoy")];
    const cola = orden.map(([id, nombre, url]) => [url, nombre, id]);
    const u = new URL(cola[0][0] + "/");
    u.searchParams.set("fkcola", b64({ c: cola, v: location.origin + location.pathname }));
    u.searchParams.set("fkpaso", "0");
    location.href = u.toString();
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
.si[disabled]{opacity:.45;cursor:not-allowed}.alt{background:none;border:1.5px solid rgba(127,127,127,.35)!important;color:inherit}
.nota{font-size:12.5px;opacity:.72;margin:0}
.ok{padding:28px 22px 24px;display:grid;gap:12px;text-align:center}.ok b{font-size:20px}.ok p{margin:0;opacity:.8}
@keyframes ap{from{opacity:0}}@keyframes sube{from{opacity:0;transform:translate(-50%,-46%) scale(.97)}}
@media (prefers-reduced-motion:reduce){.velo,.v{animation:none}}`;

  function abrir() {
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
          <p class="nota">${movil ? "Se abre cada app con su botón de instalar listo: la instalás (o la salteás) y pasa sola a la siguiente." : "Baja la carpeta «FUNGIRAK Studio» con un acceso directo a cada app. Si preferís, instalalas como apps, una tras otra."}</p>
          <div class="bs"><button class="no" data-ac="cancelar">Cancelar</button>${movil ? "" : `<button class="alt" data-ac="fila" ${elegidas.length ? "" : "disabled"}>Instalar como apps</button>`}<button class="si" data-ac="ir" ${elegidas.length ? "" : "disabled"}>${movil ? `Instalar ${elegidas.length}` : `Descargar ${elegidas.length}`}</button></div>
        </div>
      </div>`;
      r.querySelector(".x").onclick = cerrar; r.querySelector(".velo").onclick = cerrar;
      r.querySelectorAll("[data-cat]").forEach((b) => (b.onclick = () => { cat = b.dataset.cat; pintar(); }));
      r.querySelectorAll("[data-todas]").forEach((b) => (b.onclick = () => { for (const a of vis) b.dataset.todas === "1" ? marcadas.add(a[0]) : marcadas.delete(a[0]); pintar(); }));
      r.querySelectorAll("input[data-id]").forEach((c) => (c.onchange = () => { c.checked ? marcadas.add(c.dataset.id) : marcadas.delete(c.dataset.id); const y = r.querySelector(".lista").scrollTop; pintar(); r.querySelector(".lista").scrollTop = y; }));
      r.querySelector("[data-ac=cancelar]").onclick = cerrar;
      const lista = () => APPS.filter((a) => marcadas.has(a[0]));
      const fl = r.querySelector("[data-ac=fila]"); if (fl) fl.onclick = () => fila(lista());
      r.querySelector("[data-ac=ir]").onclick = async (e) => {
        if (movil) return fila(lista());
        e.target.disabled = true; e.target.textContent = "Armando la carpeta…";
        const blob = await carpeta(lista(), sistema);
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "FUNGIRAK Studio.zip"; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 60000);
        r.querySelector(".v").innerHTML = `<div class="ok"><b>✅ Listo: «FUNGIRAK Studio.zip»</b><p>Descomprimilo donde quieras y te queda la carpeta con ${lista().length} apps.${sistema === "linux" || sistema === "otro" ? " Para sumarlas al menú de aplicaciones, corré <b>sh instalar.sh</b> adentro de la carpeta." : ""}</p><div class="bs"><button class="no" data-f="1">Volver</button><button class="si" data-f="2">Instalarlas como apps</button></div></div>`;
        r.querySelector("[data-f='1']").onclick = cerrar; r.querySelector("[data-f='2']").onclick = () => fila(lista());
      };
    };
    pintar();
    document.body.appendChild(h); document.documentElement.style.overflow = "hidden"; addEventListener("keydown", tecla);
  }
  window.fkDescargar = { abrir, apps: APPS };
  // cualquier botón con data-fk-descargar la abre (así sirve también en páginas sin React, como la barra de la cuenta)
  document.addEventListener("click", (e) => { if (e.target.closest?.("[data-fk-descargar]")) { e.preventDefault(); abrir(); } });
  // Vuelta de la fila de instalación (?fklisto=N): un cartelito de festejo
  const q = new URLSearchParams(location.search);
  if (q.has("fklisto")) addEventListener("load", () => {
    const n = q.get("fklisto"), t = document.createElement("div");
    t.textContent = `🎉 Listo: instalaste ${n} app${n === "1" ? "" : "s"} de FUNGIRAK Studio. Para agruparlas, mantené apretada una y arrastrala sobre otra.`;
    t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483646;max-width:min(520px,calc(100vw - 24px));background:#111;color:#fff;padding:14px 18px;border-radius:16px;font:600 14.5px/1.4 system-ui,sans-serif;box-shadow:0 18px 40px rgba(0,0,0,.35)";
    document.body.appendChild(t); setTimeout(() => t.remove(), 9000);
    history.replaceState(null, "", location.pathname);
  });
})();
