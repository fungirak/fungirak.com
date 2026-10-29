// Historias que muestran la app funcionando: un video corto grabado de la app de verdad (o de su demo animada), en loop
// dentro de un celular. «en» es cuál de las 5 propias reemplaza (0 lo mejor, 1 comunidad, 2 además, 3 número, 4 entrar);
// «seg» es lo que dura la historia (lo que dura el video). Los videos viven en /public/demos/<archivo>.{webm,mp4,jpg}.
export const DEMOS = {
  dertin: [{ en: 0, archivo: "dertin", seg: 16.8, ojo: "ASÍ SE JUEGA", texto: "Deslizás cartas, se arma tu ADN de gustos y te presenta a tu gente." }],
  atlas: [{ en: 0, archivo: "atlas", seg: 16.9, ojo: "ASÍ FUNCIONA", texto: "Cinco preguntas y te arma la rutina a tu medida, con evidencia." }],
  surco: [{ en: 0, archivo: "surco", seg: 14, ojo: "ASÍ FUNCIONA", texto: "Mirás qué sembrar este mes y cada cultivo tiene su ficha: cuándo, cómo y con quién." }],
};

// Las propias de una app con sus demos puestas en su lugar.
export function conDemos(id, propias) {
  const d = DEMOS[id];
  if (!d) return propias;
  const r = [...propias];
  for (const x of d) if (r[x.en]) r[x.en] = { tipo: "demo", ojo: x.ojo, texto: x.texto, video: `/demos/${x.archivo}`, seg: x.seg };
  return r;
}
