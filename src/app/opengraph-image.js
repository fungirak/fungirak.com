import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Gabriel Lazzarini · fungirak · Desarrollador Full Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const foto = await readFile(join(process.cwd(), "public/img/fotoPerfil.jpg"));
  const src = `data:image/jpeg;base64,${foto.toString("base64")}`;
  const pills = ["Team Joy", "MiTour", "ECOS", "Atlas Fit Pro", "+4 años en el Estado"];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 56, padding: 72, background: "linear-gradient(135deg, #0a0d1f 0%, #1b1f44 60%, #0f3d2a 100%)", color: "#f4f6ff", fontFamily: "sans-serif" }}>
        <img src={src} alt="" width={300} height={300} style={{ borderRadius: 64, objectFit: "cover", objectPosition: "50% 30%", border: "8px solid #00e676" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          <div style={{ fontSize: 28, color: "#00e676", letterSpacing: 6, fontWeight: 700 }}>FUNGIRAK STUDIO</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>Gabriel Lazzarini</div>
          <div style={{ fontSize: 36, color: "#c3c8e8" }}>Desarrollador de Software Full Stack</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
            {pills.map((p) => (
              <div key={p} style={{ padding: "8px 20px", borderRadius: 999, background: "rgba(0,230,118,.15)", border: "2px solid rgba(0,230,118,.5)", fontSize: 24 }}>{p}</div>
            ))}
          </div>
          <div style={{ fontSize: 26, color: "#9298bf", marginTop: 10 }}>fungirak.com · Santa Fe → el mundo</div>
        </div>
      </div>
    ),
    size
  );
}
