import Link from "next/link";
import { FECHAS, estado } from "@/lib/sorteo";
import "./sorteo.css";

export const metadata = {
  title: "Bases del sorteo · FUNGIRAK Studio",
  description: "Bases y condiciones del sorteo bimestral de un sitio web y de los descuentos de la ruleta de fungirak.com.",
  alternates: { canonical: "/sorteo" },
};
export const revalidate = 300;

const largo = (f) => new Date(`${f}T12:00:00-03:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

export default async function Sorteo() {
  const st = await estado().catch(() => ({ proximo: null, participaciones: 0, ganadores: [] }));
  const ganado = Object.fromEntries((st.ganadores || []).map((g) => [g.fecha, g.codigo]));
  return (
    <main className="sorteo-page">
      <article className="sorteo">
        <Link href="/#ruleta" className="sorteo-volver">← Volver a la ruleta</Link>
        <h1>Bases y condiciones</h1>
        <p className="sorteo-sub">Sorteo bimestral de un sitio web y descuentos de la ruleta de fungirak.com · Vigentes desde el 5 de octubre de 2026.</p>

        {st.proximo && (
          <div className="sorteo-prox">
            <span>Próximo sorteo</span>
            <b>{largo(st.proximo)}</b>
            <small>{st.participaciones ? `${st.participaciones} ${st.participaciones === 1 ? "participación vigente" : "participaciones vigentes"}` : "Todavía no hay participaciones: girá la ruleta y sé el primero."}</small>
          </div>
        )}

        <h2>1. Organizador</h2>
        <p>FUNGIRAK Studio, de Gabriel Lazzarini, con domicilio en Santo Tomé, Santa Fe, Argentina (en adelante, “el Organizador”). Contacto: fungirak@gmail.com.</p>

        <h2>2. Participación gratuita</h2>
        <p>Participar es gratis y no requiere comprar ni contratar nada. Se participa sólo a través de la ruleta de fungirak.com: un giro por día por persona. El resultado de cada giro es al azar y lo decide el sistema del Organizador; <b>no siempre hay premio</b>.</p>

        <h2>3. Cómo se obtiene una participación</h2>
        <p>Cuando la ruleta sale en “Sorteo sitio”, la persona deja su email y recibe un número de participación (código <code>SORTEO-…</code>). Cada código es una chance. Se admite como máximo <b>un premio de la ruleta por email cada 30 días</b>.</p>

        <h2>4. Acumulación de chances</h2>
        <p>Cada participación sigue vigente en <b>todos los sorteos siguientes</b> durante 24 meses desde que se obtuvo, o hasta que esa persona gane. Quien participa en distintos meses acumula más chances. Quien ya ganó un sorteo no participa de los siguientes.</p>

        <h2>5. Fechas</h2>
        <p>Hay <b>un solo ganador por sorteo</b>, cada dos meses, durante dos años (12 sorteos):</p>
        <ul className="sorteo-fechas">
          {FECHAS.map((f) => (
            <li key={f} className={ganado[f] ? "hecho" : f === st.proximo ? "prox" : ""}>
              <span>{largo(f)}</span>
              <b>{ganado[f] ? `Ganador: ${ganado[f]}` : f === st.proximo ? "Próximo" : ""}</b>
            </li>
          ))}
        </ul>
        <p>Si en una fecha no hay participaciones vigentes, ese sorteo no se realiza.</p>

        <h2>6. Cómo se sortea</h2>
        <p>El sorteo lo ejecuta el sistema del Organizador con un generador de números aleatorios criptográfico, entre todas las participaciones vigentes a la fecha. El código ganador se publica en esta página y en el Instagram @fungirak. Nunca se publica el email de nadie.</p>

        <h2>7. El premio</h2>
        <p>El premio es el <b>diseño y desarrollo de un sitio web informativo</b> de hasta 5 secciones (por ejemplo: inicio, quiénes somos, servicios, galería y contacto), adaptado a celulares, con formulario de contacto y publicado en internet.</p>
        <p><b>No incluye:</b> tienda online, pagos, usuarios o login, sistemas a medida ni integraciones; dominio, hosting pago ni otros costos de terceros; redacción de textos, fotos o logo; ni mantenimiento posterior a la entrega. Si el ganador quiere algo más grande, el premio se aplica como descuento por el valor de ese sitio sobre el nuevo proyecto.</p>
        <p>El sitio se entrega dentro de los 90 días desde que el ganador envía todo el contenido. El premio es personal, no es transferible y <b>no se puede cambiar por dinero</b>.</p>

        <h2>8. Cómo se reclama</h2>
        <p>El Organizador escribe al email del ganador. El ganador tiene <b>7 días corridos</b> para responder y confirmar que es el titular de ese email. Si no responde, si los datos no coinciden o si incumple estas bases, pierde el premio y se sortea de nuevo entre las demás participaciones.</p>

        <h2>9. Descuentos de la ruleta</h2>
        <p>Los descuentos (10%, 15% o 20%) se aplican sobre el presupuesto de <b>desarrollo de proyectos nuevos</b> que se contraten con el Organizador. Valen 60 días desde que se obtienen, uno por proyecto, no se suman entre sí ni con otras promociones y no se aplican a costos de terceros (dominios, hosting, servicios externos o licencias). No son canjeables por dinero.</p>

        <h2>10. Juego limpio</h2>
        <p>Se anulan las participaciones y premios obtenidos con emails falsos o descartables, varias cuentas o emails de la misma persona, programas automáticos o cualquier forma de evitar el límite de un giro por día. El Organizador puede pedir datos para verificar la identidad del ganador.</p>

        <h2>11. Datos personales</h2>
        <p>El email y el nombre se usan sólo para gestionar el premio y avisar al ganador, no se venden ni se comparten, y se pueden borrar escribiendo a fungirak@gmail.com (Ley 25.326).</p>

        <h2>12. Cambios</h2>
        <p>El Organizador puede modificar o suspender esta promoción por causas justificadas, avisándolo en esta página. Las participaciones ya obtenidas mantienen su validez. Participar implica aceptar estas bases.</p>
      </article>
    </main>
  );
}
