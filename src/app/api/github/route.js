// Actividad pública de GitHub de fungirak (API pública, sin clave). Se cachea 1 hora.
export const revalidate = 3600;

export async function GET() {
  const h = { Accept: "application/vnd.github+json", "User-Agent": "fungirak.com" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const [u, r] = await Promise.all([
      fetch("https://api.github.com/users/fungirak", { headers: h, next: { revalidate: 3600 } }).then((x) => x.json()),
      fetch("https://api.github.com/users/fungirak/repos?per_page=100&sort=pushed", { headers: h, next: { revalidate: 3600 } }).then((x) => x.json()),
    ]);
    const repos = Array.isArray(r) ? r.filter((x) => !x.fork) : [];
    const lenguajes = {};
    for (const x of repos) if (x.language) lenguajes[x.language] = (lenguajes[x.language] || 0) + 1;
    return Response.json(
      {
        publicos: u.public_repos ?? repos.length,
        seguidores: u.followers ?? 0,
        desde: u.created_at ?? null,
        lenguajes: Object.entries(lenguajes).sort((a, b) => b[1] - a[1]),
        recientes: repos.slice(0, 5).map((x) => ({ nombre: x.name, url: x.html_url, desc: x.description, lenguaje: x.language, pushed: x.pushed_at, estrellas: x.stargazers_count })),
      },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (e) {
    console.error("github", e);
    return Response.json({ publicos: 0, lenguajes: [], recientes: [] });
  }
}
