import { getCollection } from "astro:content";
import type { APIContext } from "astro";

const COLLECTIONS = ["concepts", "entities", "tools", "patterns", "sources", "synthesis", "sessions"] as const;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(context: APIContext): Promise<Response> {
  const siteUrl = context.site?.toString().replace(/\/$/, "") ?? "";

  const all = [];
  for (const col of COLLECTIONS) {
    const entries = await getCollection(col, e => !e.data.draft);
    for (const entry of entries) {
      all.push({
        title: entry.data.title,
        summary: entry.data.summary,
        updated: entry.data.updated,
        link: `${siteUrl}/${col}/${entry.id}/`,
      });
    }
  }

  all.sort((a, b) => b.updated.getTime() - a.updated.getTime());
  const recent = all.slice(0, 50);

  const items = recent
    .map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <pubDate>${item.updated.toUTCString()}</pubDate>
      <description>${escapeXml(item.summary)}</description>
    </item>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>stack.yakbrother.dev</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>A working notebook on system design, security engineering, and AI agent architecture.</description>
    <language>en</language>
    <dc:creator>Tim Eaton</dc:creator>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
