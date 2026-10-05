import { LINKS, PERFIL } from "@/data/perfil";

// Tarjeta de contacto para agendar a Gabriel con un toque (.vcf)
export function GET() {
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Lazzarini;Gabriel;;;",
    `FN:${PERFIL.nombre}`,
    "NICKNAME:fungirak",
    "ORG:FUNGIRAK Studio",
    "TITLE:Desarrollador de Software Full Stack",
    `EMAIL;TYPE=INTERNET:${LINKS.email}`,
    `TEL;TYPE=CELL:+${LINKS.whatsapp}`,
    "URL:https://fungirak.com",
    `X-SOCIALPROFILE;TYPE=linkedin:${LINKS.linkedin}`,
    `X-SOCIALPROFILE;TYPE=instagram:${LINKS.instagram}`,
    `X-SOCIALPROFILE;TYPE=github:${LINKS.github}`,
    "ADR;TYPE=WORK:;;;Santa Fe;Santa Fe;;Argentina",
    "NOTE:Desarrollador full stack · Fundador de Team Joy y FUNGIRAK Studio",
    "END:VCARD",
  ].join("\r\n");
  return new Response(vcf, {
    headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": 'attachment; filename="gabriel-lazzarini-fungirak.vcf"' },
  });
}
