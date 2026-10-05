// Últimos videos del canal @fungirak desde el feed público de YouTube (sin clave). Cache 1 hora.
export const revalidate = 3600;
const CANAL = "UC6vJBC5tdXArThS6i2L0gTA";

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

export async function GET() {
  try {
    const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CANAL}`, { next: { revalidate: 3600 } }).then((r) => r.text());
    const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
      id: e.match(/<yt:videoId>(.*?)</)?.[1],
      titulo: decode(e.match(/<title>(.*?)<\/title>/)?.[1] || ""),
      fecha: e.match(/<published>(.*?)</)?.[1],
      vistas: Number(e.match(/views="(\d+)"/)?.[1] || 0),
    }));
    return Response.json({ videos: videos.slice(0, 8) }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (e) {
    console.error("youtube", e);
    return Response.json({ videos: [] });
  }
}
