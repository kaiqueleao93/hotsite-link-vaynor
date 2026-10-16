// Regras puras do editor: nenhuma função aqui toca no DOM.
window.Vaynor = window.Vaynor || {};
const MAX_LINKS = 12;
const buttonStyles = ['rounded', 'pill', 'outline'];
const linkIcons = [
  { id: 'links', label: 'Link' },
  { id: 'store', label: 'Loja ou pedidos' },
  { id: 'message', label: 'Mensagem' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'briefcase', label: 'Serviços' },
  { id: 'sparkles', label: 'Conteúdo' },
  { id: 'palette', label: 'Design' },
  { id: 'devices', label: 'Dispositivos' },
  { id: 'phone', label: 'Telefone' },
  { id: 'desktop', label: 'Site' },
  { id: 'play', label: 'Vídeo' }
];
function cloneExample(example) { return structuredClone(example); }
function validUrl(value) {
  try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) && Boolean(u.hostname) && !u.username && !u.password; } catch { return false; }
}
function isSampleUrl(value) {
  try { const h = new URL(value).hostname.toLowerCase(); return ['example.com', 'example.org', 'example.net'].some(d => h === d || h.endsWith(`.${d}`)); } catch { return false; }
}
function readableForeground(hex) {
  const rgb = hex.replace('#', '').match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  const luminance = .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  return (1.05 / (luminance + .05)) >= 4.5 ? '#FFFFFF' : '#000000';
}
function updateProfile(state, field, value) {
  if (!['name', 'description', 'accent', 'style'].includes(field)) throw new Error('Campo desconhecido.');
  if (field === 'accent' && !/^#[0-9a-f]{6}$/i.test(value)) throw new Error('Cor inválida.');
  if (field === 'style' && !buttonStyles.includes(value)) throw new Error('Estilo inválido.');
  const limits = { name: 60, description: 180 };
  return { ...state, [field]: limits[field] ? String(value).slice(0, limits[field]) : value };
}
function updateLink(state, id, field, value) {
  if (!['title', 'subtitle', 'url', 'active', 'icon'].includes(field)) throw new Error('Campo de link desconhecido.');
  if (!state.links.some(link => link.id === id)) throw new Error('Link não encontrado.');
  if (field === 'icon' && !linkIcons.some(option => option.id === value)) throw new Error('Ícone de link inválido.');
  const limits = { title: 60, subtitle: 80, url: 2048 };
  return { ...state, links: state.links.map(link => link.id === id ? { ...link, [field]: field === 'active' ? Boolean(value) : field === 'icon' ? value : String(value).slice(0, limits[field]) } : link) };
}
function addLink(state, id) {
  if (state.links.length >= MAX_LINKS) throw new Error('A demonstração permite até 12 links.');
  if (state.links.some(link => link.id === id)) throw new Error('Identificador duplicado.');
  return { ...state, links: [...state.links, { id, title: 'Novo link', subtitle: '', url: '', icon: 'links', active: true }] };
}
function removeLink(state, id) { return { ...state, links: state.links.filter(link => link.id !== id) }; }
function moveLink(state, id, delta) {
  const index = state.links.findIndex(link => link.id === id);
  const next = index + delta;
  if (index < 0 || ![-1, 1].includes(delta) || next < 0 || next >= state.links.length) return state;
  const links = [...state.links];
  [links[index], links[next]] = [links[next], links[index]];
  return { ...state, links };
}
function createDraft(state, contact) {
  return { schemaVersion: 1, type: 'local-interest-draft', published: false, sent: false, contact: { name: contact.name.trim(), email: contact.email.trim() }, page: structuredClone(state) };
}

Object.assign(window.Vaynor, {
  MAX_LINKS,
  buttonStyles,
  linkIcons,
  cloneExample,
  validUrl,
  isSampleUrl,
  readableForeground,
  updateProfile,
  updateLink,
  addLink,
  removeLink,
  moveLink,
  createDraft
});
