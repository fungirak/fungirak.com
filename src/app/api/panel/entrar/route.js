import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_PANEL, CUENTA, HORAS_PANEL, ID_PANEL, sesionPanel, valorSesion, verificarPase } from "@/lib/panel-acceso";
import { registrar } from "@/lib/auditoria";

// Entrada al panel con la Cuenta FUNGIRAK. Sin pase: te manda a la cuenta, que pide rol admin + código de dos pasos.
// Con ?pase: verifica la firma (ES256, para «estudio», 2 minutos) y abre el panel con una cookie propia. ?yo=1 dice si está abierto.
const NO = { "Cache-Control": "no-store" };
export async function GET(req) {
  const q = new URL(req.url).searchParams;
  if (q.get("yo")) { const u = await sesionPanel(); return Response.json({ admin: !!u, usuario: u || null, listo: !!process.env.FUNGIRAK_ADMIN_KEY }, { headers: NO }); }
  const pase = q.get("pase");
  if (!pase) return NextResponse.redirect(`${CUENTA}/admin/pase?app=${ID_PANEL}`, 302);
  const c = await verificarPase(pase).catch(() => null);
  if (!c || !process.env.PANEL_SECRETO) return NextResponse.redirect(new URL("/panel?error=pase", req.url), 302);
  (await cookies()).set(COOKIE_PANEL, valorSesion(c.usuario || c.sub), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: HORAS_PANEL * 3600 });
  await registrar(req, "panel.entrada_cuenta", { usuario: c.usuario || null }).catch(() => {});
  return NextResponse.redirect(new URL("/panel", req.url), 302);
}
// Salir del panel.
export async function DELETE() {
  (await cookies()).delete({ name: COOKIE_PANEL, path: "/" });
  return Response.json({ ok: true }, { headers: NO });
}
