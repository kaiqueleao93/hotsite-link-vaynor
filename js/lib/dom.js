window.Vaynor = window.Vaynor || {};
window.Vaynor.$ = selector => document.querySelector(selector);
window.Vaynor.$$ = selector => document.querySelectorAll(selector);

window.Vaynor.esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

window.Vaynor.scrollBehavior = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth');
