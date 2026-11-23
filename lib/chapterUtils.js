// Pure helpers shared by server + client code (no DB / React imports).

/** blocks -> editable text. One line per bullet; "- " in front of a line = sub-bullet. */
export function blocksToText(blocks = []) {
  const lines = [];
  for (const b of blocks || []) {
    if (b.type === 'ul') (b.items || []).forEach((it) => lines.push(`- ${it}`));
    else if (b.text) lines.push(b.text);
  }
  return lines.join('\n');
}

/** editable text -> blocks (consecutive "- " lines become one list block). */
export function textToBlocks(text = '') {
  const blocks = [];
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^[-•*]\s+(.*)$/);
    if (m) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === 'ul') last.items.push(m[1]);
      else blocks.push({ type: 'ul', items: [m[1]] });
    } else {
      blocks.push({ type: 'p', text: line });
    }
  }
  return blocks;
}

export const slugify = (s = '') =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);

const filled = (v) => typeof v === 'string' && v.trim().length > 0;

/**
 * Returns the chapter's text in the visitor's language.
 * Hindi: uses the Hindi fields saved in the admin panel; any field left empty falls back to the
 * built-in dictionary (t) and finally to the English text, so nothing ever renders blank.
 */
export function localizeChapter(c, lang, t) {
  if (lang !== 'hi') {
    return {
      title: c.title,
      summary: c.summary || '',
      resolve: c.resolve || '',
      closing: (c.closing || []).filter(filled),
      content: c.content || [],
    };
  }
  const h = c.hi || {};
  const tl = (en) => (filled(en) ? t(en) : en);
  const hiContent = Array.isArray(h.content) && h.content.length ? h.content : null;
  return {
    title: filled(h.title) ? h.title : tl(c.title),
    summary: filled(h.summary) ? h.summary : tl(c.summary || ''),
    resolve: filled(h.resolve) ? h.resolve : tl(c.resolve || ''),
    closing: (Array.isArray(h.closing) && h.closing.some(filled) ? h.closing : c.closing || [])
      .filter(filled)
      .map((x) => (Array.isArray(h.closing) && h.closing.some(filled) ? x : t(x))),
    content:
      hiContent ||
      (c.content || []).map((b) =>
        b.type === 'ul' ? { ...b, items: (b.items || []).map((i) => t(i)) } : { ...b, text: t(b.text) }
      ),
  };
}
