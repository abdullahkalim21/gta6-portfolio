import { marked } from "marked";

/**
 * Renders Markdown written by you (src/content or the admin dashboard).
 * Raw HTML tags are escaped so a tampered DB row can't inject scripts.
 */
export function renderMarkdown(md: string): string {
  const escaped = md.replace(/<(?=[a-zA-Z/!?])/g, "&lt;");
  const html = marked.parse(escaped, { async: false, gfm: true }) as string;
  // Neutralise javascript: links that Markdown link syntax could still produce.
  return html.replace(/href="\s*javascript:[^"]*"/gi, 'href="#"');
}
