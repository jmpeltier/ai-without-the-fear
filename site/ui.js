export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'class') el.className = value;
    else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
    else el.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function sectionHeader(section, lede) {
  return h('header', { class: 'section-head' },
    h('p', { class: 'eyebrow' }, `${section.icon} Part ${section.number} · about ${section.minutes} min`),
    h('h1', {}, section.title),
    lede && h('p', { class: 'lede' }, lede),
  );
}

export const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(`aiwtf:${key}`);
      return raw == null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(`aiwtf:${key}`, JSON.stringify(value)); } catch {}
  },
};
