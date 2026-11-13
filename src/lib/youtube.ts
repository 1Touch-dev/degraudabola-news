/** Extract a YouTube video id from common watch / embed / short / shorts URLs. */
export function youtubeId(url?: string | null): string | null {
  if (!url?.trim()) return null;
  const value = url.trim();
  const embed = value.match(/youtube\.com\/embed\/([^?&/]+)/i);
  if (embed?.[1]) return embed[1];
  const shorts = value.match(/youtube\.com\/shorts\/([^?&/]+)/i);
  if (shorts?.[1]) return shorts[1];
  const watch = value.match(/[?&]v=([^&]+)/i);
  if (watch?.[1]) return watch[1];
  const short = value.match(/youtu\.be\/([^?&/]+)/i);
  return short?.[1] || null;
}

export function uniqueYoutubeIds(urls: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const url of urls) {
    const id = youtubeId(url);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

export function youtubeEmbedHtml(id: string, title = 'YouTube'): string {
  return `<div class="article-youtube aspect-video overflow-hidden rounded-xl border border-white/10 bg-black my-6"><iframe title="${title.replace(/"/g, '&quot;')}" src="https://www.youtube.com/embed/${id}" class="h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
}
