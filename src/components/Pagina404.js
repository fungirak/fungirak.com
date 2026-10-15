import Link from "next/link";

// Página «esto no existe», animada (inspirada en la de Team Joy): el ícono de la app rebota y late, el 404 con degradé,
// adornos que flotan alrededor y el botón principal que late. Con «reducir movimiento» queda quieta.
// icono: imagen de la app · figura: un dibujo propio en vez del ícono (p. ej. Pipa en MiTour) · acciones: [{ href, t }]
export default function Pagina404({ icono, figura, titulo, texto, acciones = [], adornos = [], clase = "btn", clase2 = "btn btn-ghost", color }) {
  return (
    <section className="p404" style={color ? { "--p404": color } : undefined}>
      <div className="p404-escena" aria-hidden="true">
        {adornos.slice(0, 4).map((a, i) => <span key={i} className={`p404-flota p404-f${i + 1}`}>{a}</span>)}
        <span className="p404-aro" />
        <span className="p404-logo">{figura || <img src={icono} alt="" width="112" height="112" />}</span>
      </div>
      <p className="p404-num" aria-hidden="true">404</p>
      <h1>{titulo}</h1>
      <p className="p404-txt">{texto}</p>
      <div className="p404-acc">
        {acciones.map((a, i) => <Link key={a.href} href={a.href} className={i === 0 ? `${clase} p404-late` : clase2}>{a.t}</Link>)}
      </div>
      <p className="p404-ayuda">¿Llegaste desde un enlace que no anda? <a href="mailto:fungirak@gmail.com?subject=Enlace%20roto">Avisanos</a> y lo arreglamos.</p>
    </section>
  );
}
