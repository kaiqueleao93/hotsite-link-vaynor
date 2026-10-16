// Os desenhos ficam no sprite SVG do index.html (<symbol id="i-…">).
const known = new Set(['links', 'store', 'message', 'instagram', 'briefcase', 'sparkles', 'palette', 'devices', 'phone', 'desktop', 'check', 'plus', 'up', 'down', 'trash', 'reset', 'close', 'play', 'download', 'external', 'info']);

function icon(name, className = '') {
  const id = known.has(name) ? name : 'links';
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${id}"/></svg>`;
}

window.Vaynor = window.Vaynor || {};
window.Vaynor.icon = icon;
