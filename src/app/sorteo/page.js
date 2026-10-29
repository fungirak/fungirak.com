import Link from "next/link";
import { FECHAS, CRITERIOS, IDEA_MIN, IDEA_MAX, estado } from "@/lib/sorteo";
import Participar from "./Participar";
import "./sorteo.css";

export const metadata = {
  title: "Concurso de ideas · FUNGIRAK Studio",
  description: "Bases del concurso bimestral de ideas (premio: un sitio web) y de la ruleta de los que vuelven de fungirak.com.",
  alternates: { canonical: "/sorteo" },
};
export const revalidate = 300;

const largo = (f) => new Date(`${f}T12:00:00-03:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

export default async function Concurso() {
  const st = await estado().catch(() => ({ proximo: null, ideas: 0, ganadores: [] }));
  const ganado = Object.fromEntries((st.ganadores || []).map((g) => [g.fecha, g.codigo]));
  return (
    <main className="sorteo-page">
      <article className="sorteo">
        <Link href="/#ruleta" className="sorteo-volver">← Volver a fungirak.com</Link>
        <h1>Concurso de ideas</h1>
        <p className="sorteo-sub">Bases del concurso bimestral de un sitio web y de la ruleta de fungirak.com · Vigentes desde el 30 de octubre de 2026 (reemplazan a las bases del sorteo del 5 de octubre de 2026).</p>

        {st.proximo && (
          <div className="sorteo-prox">
            <span>Próxima edición</span>
            <b>{largo(st.proximo)}</b>
            <small>{st.ideas ? `${st.ideas} ${st.ideas === 1 ? "idea participando" : "ideas participando"}` : "Todavía no hay ideas: mandá la primera."}</small>
          </div>
        )}
        {st.proximo && <Participar min={IDEA_MIN} max={IDEA_MAX} />}

        <h2>1. Organizador</h2>
        <p>FUNGIRAK Studio, de Gabriel Lazzarini, con domicilio en Santo Tomé, Santa Fe, Argentina (en adelante, “el Organizador”). Contacto: fungirak@gmail.com.</p>

        <h2>2. Qué es</h2>
        <p>Un concurso de ideas, gratuito y sin obligación de comprar ni contratar nada. Cada dos meses, la mejor idea para un sitio web gana el diseño y desarrollo de ese sitio. <b>No interviene el azar</b>: gana la idea que el Organizador elige según los criterios publicados en el punto 5.</p>

        <h2>3. Quién puede participar</h2>
        <p>Personas mayores de 18 años, o de 13 a 17 con el conocimiento y la conformidad de una persona adulta a cargo, que mandan su idea con un email propio. Una idea por email y por edición; se puede corregir hasta el día de la edición mandándola de nuevo con el mismo email. Quien ya ganó una edición no participa de las siguientes.</p>

        <h2>4. Cómo se participa</h2>
        <p>Con el formulario de esta página: email, nombre (opcional) y la idea, contada en {IDEA_MIN} a {IDEA_MAX} caracteres (qué sitio, para qué y para quién). Cada idea recibe un código <code>IDEA-…</code>. Cada idea participa solo en la edición siguiente a su envío; para las próximas, se manda de nuevo.</p>

        <h2>5. Cómo se elige</h2>
        <p>El día de cada edición, el Organizador lee todas las ideas y elige una, valorando:</p>
        <ul>{CRITERIOS.map(([c, d]) => <li key={c}><b>{c}:</b> {d}.</li>)}</ul>
        <p>Si ninguna idea cumple mínimamente con estos criterios, la edición puede quedar desierta. Se publica solo el código de la idea ganadora, en esta página y en el Instagram @fungirak; nunca el email.</p>

        <h2>6. Fechas</h2>
        <p>Una ganadora por edición, cada dos meses, durante dos años (12 ediciones):</p>
        <ul className="sorteo-fechas">
          {FECHAS.map((f) => (
            <li key={f} className={ganado[f] ? "hecho" : f === st.proximo ? "prox" : ""}>
              <span>{largo(f)}</span>
              <b>{ganado[f] ? `Ganó: ${ganado[f]}` : f === st.proximo ? "Próxima" : ""}</b>
            </li>
          ))}
        </ul>

        <h2>7. El premio</h2>
        <p>El premio es el <b>diseño y desarrollo de un sitio web informativo</b> de hasta 5 secciones (por ejemplo: inicio, quiénes somos, servicios, galería y contacto), adaptado a celulares, con formulario de contacto y publicado en internet.</p>
        <p><b>No incluye:</b> tienda online, pagos, usuarios o login, sistemas a medida ni integraciones; dominio, hosting pago ni otros costos de terceros; redacción de textos, fotos o logo; ni mantenimiento posterior a la entrega. Si quien gana quiere algo más grande, el premio se aplica como descuento por el valor de ese sitio sobre el nuevo proyecto.</p>
        <p>El sitio se entrega dentro de los 90 días desde que se envía todo el contenido. El premio es personal, no es transferible y <b>no se puede cambiar por dinero</b>. El sitio no puede usarse para actividades prohibidas por los términos de la Fábrica de FUNGIRAK.</p>

        <h2>8. Cómo se reclama</h2>
        <p>El Organizador escribe al email de la idea ganadora. Hay <b>7 días corridos</b> para responder y confirmar que se es titular de ese email. Si no hay respuesta, si los datos no coinciden o si se incumplen estas bases, el Organizador puede elegir otra idea de la misma edición.</p>

        <h2>9. La ruleta de los que vuelven</h2>
        <p>La ruleta de fungirak.com <b>no es un juego de azar</b>: siempre da un premio, y el premio depende de cuántos días distintos volviste a girarla. Día 1: 10% de descuento. Día 2: 15% de descuento. Día 3: un mes gratis del plan FUNGIRAK. Del día 4 en adelante: 20% de descuento. Un giro por día por persona.</p>
        <p>Los descuentos se aplican sobre el presupuesto de <b>desarrollo de proyectos nuevos</b> que se contraten con el Organizador. Valen 60 días, uno por proyecto, no se suman entre sí ni con otras promociones y no se aplican a costos de terceros (dominios, hosting, servicios externos o licencias). El mes del plan se canjea en cuenta.fungirak.com. Hay un premio vigente por email cada 30 días: si volvés y subís de escalón, el premio nuevo reemplaza al anterior que todavía no usaste. Ningún premio es canjeable por dinero.</p>

        <h2>10. Juego limpio</h2>
        <p>Se anulan las ideas y los premios obtenidos con emails falsos o descartables, varias cuentas o emails de la misma persona, programas automáticos o cualquier forma de evitar los límites. Las ideas tienen que ser propias y no pueden copiar proyectos ajenos ni infringir derechos de terceros. El Organizador puede pedir datos para verificar la identidad de quien gana.</p>

        <h2>11. Las ideas</h2>
        <p>Quien participa conserva sus derechos sobre su idea. Al mandarla, autoriza al Organizador a leerla y evaluarla y, si gana, a mostrar el sitio que resulte como parte de su portfolio. Las ideas que no ganan no se publican.</p>

        <h2>12. Datos personales</h2>
        <p>El email, el nombre y la idea se usan sólo para el concurso y la ruleta, no se venden ni se comparten, se borran a los 26 meses y se pueden borrar antes escribiendo a fungirak@gmail.com (Ley 25.326). Detalle en <a href="https://cuenta.fungirak.com/legal/sitios">cuenta.fungirak.com/legal/sitios</a>.</p>

        <h2>13. Cambio desde el sorteo anterior</h2>
        <p>Hasta el 29 de octubre de 2026 el premio se sorteaba. Desde el 30 de octubre gana la mejor idea. Quienes tenían un número de participación del sorteo reciben un aviso por email y siguen participando mandando su idea con el mismo email.</p>

        <h2>14. Cambios</h2>
        <p>El Organizador puede modificar o suspender esta promoción por causas justificadas, avisándolo en esta página. Las ideas ya enviadas mantienen su validez para la edición en curso. Participar implica aceptar estas bases.</p>
      </article>
    </main>
  );
}
