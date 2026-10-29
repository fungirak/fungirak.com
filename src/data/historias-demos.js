// Historias que muestran la app funcionando: un video corto grabado de la app de verdad (o de su demo animada), en loop
// dentro de un celular. «en» es cuál de las 5 propias reemplaza (0 lo mejor, 1 comunidad, 2 además, 3 número, 4 entrar);
// «seg» es lo que dura la historia (lo que dura el video). Los videos viven en /public/demos/<archivo>.{webm,mp4,jpg}.
export const DEMOS = {
  teamjoy: [{ en: 0, archivo: "teamjoy", seg: 7.8, ojo: "ASÍ SE VIVE", texto: "Reconocimientos, desafíos y cumpleaños: lo que pasa en tu equipo, en un solo muro." }],
  dertin: [{ en: 0, archivo: "dertin", seg: 16.8, ojo: "ASÍ SE JUEGA", texto: "Deslizás cartas, se arma tu ADN de gustos y te presenta a tu gente." }],
  cronicas: [{ en: 0, archivo: "cronicas", seg: 11.2, ojo: "ASÍ ES EL VIAJE", texto: "Un honguito contra el Sistema Solar: cada mundo, con datos reales." }],
  atlas: [{ en: 0, archivo: "atlas", seg: 16.9, ojo: "ASÍ FUNCIONA", texto: "Cinco preguntas y te arma la rutina a tu medida, con evidencia." }],
  mitour: [{ en: 0, archivo: "mitour", seg: 11.0, ojo: "ASÍ FUNCIONA", texto: "Elegís un destino y tenés qué ver, cuánto sale y cuándo ir." }],
  atalaya: [{ en: 0, archivo: "atalaya", seg: 14.6, ojo: "ASÍ TE CUIDA", texto: "Pegás el mensaje raro y te dice si es estafa y por qué." }],
  musgui: [{ en: 0, archivo: "musgui", seg: 9.7, ojo: "ASÍ EMPIEZA", texto: "Adoptás tu Musgui y vive con el clima de tu ciudad." }],
  mate: [{ en: 0, archivo: "mate", seg: 14.8, ojo: "ASÍ SE CEBA", texto: "Siete pasos, del agua justa a la bombilla en su lugar." }],
  asador: [{ en: 0, archivo: "asador", seg: 13.1, ojo: "ASÍ FUNCIONA", texto: "Decile para cuántos es y te calcula los kilos, los cortes y la plata." }],
  surco: [{ en: 0, archivo: "surco", seg: 14.0, ojo: "ASÍ FUNCIONA", texto: "Mirás qué sembrar este mes y cada cultivo tiene su ficha: cuándo, cómo y con quién." }],
  micoteca: [{ en: 0, archivo: "micoteca", seg: 14.4, ojo: "ASÍ FUNCIONA", texto: "El atlas de los hongos del país: fotos, temporada y dónde los vieron." }],
  "carta-al-futuro": [{ en: 0, archivo: "carta-al-futuro", seg: 13.1, ojo: "ASÍ SE ESCRIBE", texto: "Le escribís a tu yo del futuro y la carta queda sellada hasta su día." }],
  hoy: [{ en: 0, archivo: "hoy", seg: 8.2, ojo: "ASÍ FUNCIONA", texto: "El mejor día para cada cosa de tu semana, de un vistazo." }],
  cv: [{ en: 0, archivo: "cv", seg: 11.0, ojo: "ASÍ SE ARMA", texto: "Paso a paso, tu CV listo en diez minutos." }],
  preguntas: [{ en: 0, archivo: "preguntas", seg: 8.0, ojo: "ASÍ FUNCIONA", texto: "Elegís con quién y cada día hay una pregunta nueva para charlar." }],
  escanea: [{ en: 0, archivo: "escanea", seg: 11.0, ojo: "ASÍ FUNCIONA", texto: "Guías por documento: cómo escanear tu DNI para que no te lo rebote nadie." }],
  pasalo: [{ en: 0, archivo: "pasalo", seg: 6.2, ojo: "ASÍ FUNCIONA", texto: "Del celu a la compu en segundos, con un código y sin cables." }],
  termometro: [{ en: 0, archivo: "termometro", seg: 7.8, ojo: "ASÍ SE MIDE", texto: "Una pregunta por día y lo que piensa tu ciudad, con votos verificados." }],
  rinde: [{ en: 0, archivo: "rinde", seg: 10.0, ojo: "ASÍ FUNCIONA", texto: "Ponés cuánto tenés y ves dónde rinde más, frente a la inflación." }],
  "que-hago-hoy": [{ en: 0, archivo: "que-hago-hoy", seg: 7.8, ojo: "ASÍ SE VIVE", texto: "La pared de la ciudad: eventos de hoy y gente que se anota." }],
  "escuela-del-pescador": [{ en: 0, archivo: "escuela-del-pescador", seg: 11.2, ojo: "ASÍ FUNCIONA", texto: "La altura del río en cada puerto, antes de salir a pescar." }],
  "escuela-de-mascotas": [{ en: 0, archivo: "escuela-de-mascotas", seg: 8.4, ojo: "ASÍ FUNCIONA", texto: "¿Le puedo dar esto? Lo buscás y te responde en un segundo." }],
  "primeros-auxilios": [{ en: 0, archivo: "primeros-auxilios", seg: 12.3, ojo: "ASÍ TE GUÍA", texto: "Paso a paso y con el metrónomo de la RCP, para no dudar." }],
  trivia: [{ en: 0, archivo: "trivia", seg: 6.4, ojo: "ASÍ SE JUEGA", texto: "Diez preguntas por día, iguales para todo el país, y después las respuestas." }],
  figus: [{ en: 0, archivo: "figus", seg: 7.2, ojo: "ASÍ SE JUEGA", texto: "Abrís el sobre del día y tus figus van directo al álbum." }],
  voluntarios: [{ en: 0, archivo: "voluntarios", seg: 7.8, ojo: "ASÍ SE VIVE", texto: "Convocatorias cerca tuyo y gente que se suma a dar una mano." }],
  prode: [{ en: 0, archivo: "prode", seg: 8.2, ojo: "ASÍ SE JUEGA", texto: "La fecha completa de tu liga para pronosticar con tus amigos." }],
  afinados: [{ en: 0, archivo: "afinados", seg: 9.6, ojo: "ASÍ FUNCIONA", texto: "Cantás y te muestra la nota en vivo: si estás arriba o abajo." }],
  "santafe-oculta": [{ en: 0, archivo: "santafe-oculta", seg: 11.0, ojo: "ASÍ SE RECORRE", texto: "La ciudad en capítulos: llegás al lugar y la historia se abre." }],
  fabrica: [{ en: 0, archivo: "fabrica", seg: 12.8, ojo: "ASÍ SE FABRICA", texto: "Le contás una idea y la máquina arma tu sitio." }],
  ecos: [{ en: 0, archivo: "ecos", seg: 13.5, ojo: "ASÍ SE VE", texto: "El mapa 3D de las ondas que te rodean, en vivo." }],
};

// Las propias de una app con sus demos puestas en su lugar.
export function conDemos(id, propias) {
  const d = DEMOS[id];
  if (!d) return propias;
  const r = [...propias];
  for (const x of d) if (r[x.en]) r[x.en] = { tipo: "demo", ojo: x.ojo, texto: x.texto, video: `/demos/${x.archivo}`, seg: x.seg };
  return r;
}
