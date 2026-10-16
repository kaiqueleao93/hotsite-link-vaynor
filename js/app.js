(() => {
'use strict';

const {
  brand,
  pricing,
  priceLabel,
  priceSuffix,
  examples,
  addLink,
  cloneExample,
  isSampleUrl,
  moveLink,
  readableForeground,
  removeLink,
  updateLink,
  updateProfile,
  validUrl,
  MAX_LINKS,
  linkIcons,
  $,
  esc,
  scrollBehavior,
  icon
} = window.Vaynor;

let state = cloneExample(examples.restaurant);
let selectedExample = 'restaurant';
let view = 'phone';
let toastTimer;
let previousTrigger = null;
let localDraft = null;
let chosenPlan = null;

function notify(message) {
  const feedback = $('#feedback');
  feedback.textContent = message;
  feedback.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => feedback.classList.remove('visible'), 5500);
}

function previewMarkup() {
  const initials = state.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase() || 'SL';
  const links = state.links.filter(link => link.active);
  const linkMarkup = links.length
    ? links.map(link => {
      const title = link.title.trim() || 'Link sem título';
      const body = `${icon(link.icon)}<span><strong>${esc(title)}</strong>${link.subtitle ? `<small>${esc(link.subtitle)}</small>` : ''}</span>${icon('external', 'link-external')}`;
      const safe = validUrl(link.url) && !isSampleUrl(link.url);
      return safe
        ? `<a class="preview-link" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(title)} — abre em nova aba">${body}</a>`
        : `<button type="button" class="preview-link" data-demo-link="${esc(link.id)}">${body}</button>`;
    }).join('')
    : '<p class="empty-preview">Seus links ativos aparecerão aqui.<br>Adicione ou ative um link no editor.</p>';

  return `<p class="preview-avatar" aria-hidden="true">${esc(initials)}</p><p class="preview-name">${esc(state.name.trim() || 'Seu negócio')}</p><p class="preview-description">${esc(state.description)}</p><div class="preview-links">${linkMarkup}</div><p class="preview-brand"><span class="preview-signature">Feito com <span class="brand-image"><img src="${esc(brand.logo.src)}" alt="${esc(brand.logo.alt)}" width="1254" height="1254"></span></span><span>Exemplo demonstrativo</span></p>`;
}

function renderPreview() {
  const foreground = readableForeground(state.accent);
  for (const target of ['#live-preview', '#hero-preview']) {
    const element = $(target);
    element.style.setProperty('--profile-accent', state.accent);
    element.style.setProperty('--profile-foreground', foreground);
    element.style.setProperty('--profile-readable', foreground === '#FFFFFF' ? state.accent : '#101828');
    element.dataset.style = state.style;
    element.innerHTML = previewMarkup();
  }
  $('#description-count').textContent = state.description.length;
  $('#hero-caption').textContent = `Prévia do editor · ${state.name.trim() || 'Seu negócio'}`;
  $('#link-count').textContent = state.links.length;
  $('#color-value').textContent = state.accent.toUpperCase();
  $('#add-link').disabled = state.links.length >= MAX_LINKS;
}

function syncInputs() {
  $('#business-name').value = state.name;
  $('#business-description').value = state.description;
  $('#custom-color').value = state.accent;
  document.querySelectorAll('[name="accent"]').forEach(input => {
    input.checked = input.value.toLowerCase() === state.accent.toLowerCase();
  });
  document.querySelectorAll('[name="button-style"]').forEach(input => {
    input.checked = input.value === state.style;
  });
  document.querySelectorAll('[data-example]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.example === selectedExample));
  });
}

function urlError(link) {
  if (!link.url) return 'Adicione um endereço para abrir este link.';
  if (!validUrl(link.url)) return 'Use um endereço completo com http:// ou https://, sem usuário e senha.';
  return isSampleUrl(link.url) ? 'Endereço demonstrativo. Este destino não será aberto.' : '';
}

function renderLinks() {
  $('#link-editor').innerHTML = state.links.length
    ? state.links.map((link, index) => `
      <article class="link-card ${link.active ? '' : 'inactive'}" data-link-card="${esc(link.id)}">
        <div class="link-card-top">
          <span class="link-index">${String(index + 1).padStart(2, '0')}</span>
          <div class="reorder-controls">
            <button type="button" class="icon-button" data-move="-1" data-id="${esc(link.id)}" aria-label="Mover link ${index + 1} para cima" ${index === 0 ? 'disabled' : ''}>${icon('up')}</button>
            <button type="button" class="icon-button" data-move="1" data-id="${esc(link.id)}" aria-label="Mover link ${index + 1} para baixo" ${index === state.links.length - 1 ? 'disabled' : ''}>${icon('down')}</button>
          </div>
          <label class="toggle"><input type="checkbox" data-active="${esc(link.id)}" ${link.active ? 'checked' : ''}><span aria-hidden="true"></span><span class="sr-only">Ativar link ${index + 1}</span></label>
          <button type="button" class="icon-button delete-button" data-remove="${esc(link.id)}" aria-label="Remover link ${index + 1}">${icon('trash')}</button>
        </div>
        <div class="field">
          <label for="icon-${esc(link.id)}">Ícone do link ${index + 1}</label>
          <select id="icon-${esc(link.id)}" data-link-field="icon" data-id="${esc(link.id)}">
            ${linkIcons.map(option => `<option value="${option.id}" ${link.icon === option.id ? 'selected' : ''}>${option.label}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label for="title-${esc(link.id)}">Título do link ${index + 1}</label><input id="title-${esc(link.id)}" data-link-field="title" data-id="${esc(link.id)}" maxlength="60" value="${esc(link.title)}"></div>
        <div class="field"><label for="subtitle-${esc(link.id)}">Texto de apoio ${index + 1} <span class="optional">(opcional)</span></label><input id="subtitle-${esc(link.id)}" data-link-field="subtitle" data-id="${esc(link.id)}" maxlength="80" value="${esc(link.subtitle)}"></div>
        <div class="field"><label for="url-${esc(link.id)}">Endereço do link ${index + 1}</label><input id="url-${esc(link.id)}" type="url" data-link-field="url" data-id="${esc(link.id)}" maxlength="2048" value="${esc(link.url)}" placeholder="https://" autocomplete="off" aria-describedby="hint-${esc(link.id)}" aria-invalid="${Boolean(link.url && !validUrl(link.url))}"><span class="field-hint ${link.url && !validUrl(link.url) ? 'error' : ''}" id="hint-${esc(link.id)}">${esc(urlError(link))}</span></div>
      </article>`).join('')
    : '<div class="empty-editor">Nenhum link por enquanto. Adicione seu primeiro canal abaixo.</div>';
}

function changeTab(tab, focus = false) {
  const names = ['profile', 'links', 'style'];
  if (!names.includes(tab)) return;
  names.forEach(name => {
    const selected = name === tab;
    $(`#tab-${name}`).setAttribute('aria-selected', String(selected));
    $(`#tab-${name}`).tabIndex = selected ? 0 : -1;
    $(`#panel-${name}`).hidden = !selected;
  });
  if (focus) $(`#tab-${tab}`).focus();
}

function selectExample(id, announce = true) {
  if (!Object.hasOwn(examples, id)) throw new Error('Exemplo inválido.');
  selectedExample = id;
  state = cloneExample(examples[id]);
  syncInputs();
  renderLinks();
  renderPreview();
  if (announce) {
    const kind = id === 'restaurant' ? 'de restaurante' : id === 'professional' ? 'profissional' : 'de criador';
    notify(`Exemplo ${kind} carregado. A prévia anterior foi substituída.`);
  }
}

function openDraft(trigger) {
  previousTrigger = trigger;
  localDraft = {
    schemaVersion: 1,
    type: 'local-page-draft',
    published: false,
    sent: false,
    page: cloneExample(state)
  };
  if (chosenPlan) {
    localDraft.planPreference = {
      id: chosenPlan.id,
      name: chosenPlan.name,
      amountCents: chosenPlan.amountCents,
      currency: pricing.currency,
      cycle: chosenPlan.amountCents === 0 ? 'free' : 'monthly',
      paid: false,
      accountCreated: false
    };
  }
  $('#draft-summary').innerHTML = `<strong>${esc(localDraft.page.name || 'Seu negócio')}</strong><span>${localDraft.page.links.length} links no rascunho</span>${chosenPlan ? `<span>Sua escolha: ${esc(chosenPlan.name)} · ${esc(priceLabel(chosenPlan))}${priceSuffix(chosenPlan)}</span>` : ''}`;
  $('#draft-status').textContent = '';
  $('#interest-dialog').showModal();
}

function closeConversion() {
  $('#interest-dialog').close();
  previousTrigger?.focus();
}

function downloadDraft() {
  if (!localDraft) return;
  const button = $('#download-draft');
  button.disabled = true;
  button.innerHTML = `${icon('download')}Preparando arquivo…`;
  try {
    const blob = new Blob([JSON.stringify(localDraft, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'vaynor-rascunho.json';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('#draft-status').textContent = 'Rascunho preparado para download. Nenhum dado foi enviado e nenhuma página foi publicada.';
    $('#draft-status').className = 'form-status success';
  } catch (error) {
    console.error('Não foi possível preparar o rascunho para download.', error);
    $('#draft-status').textContent = 'Não foi possível preparar o arquivo. Tente novamente neste navegador.';
    $('#draft-status').className = 'form-status error';
  } finally {
    button.disabled = false;
    button.innerHTML = `${icon('download')}Baixar meu rascunho`;
  }
}

function setView(next) {
  if (!['phone', 'desktop'].includes(next)) throw new Error('Visualização inválida.');
  view = next;
  $('#device-frame').classList.toggle('desktop-frame', next === 'desktop');
  $('#preview-stage').classList.toggle('desktop-stage', next === 'desktop');
  document.querySelectorAll('[data-view]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === next));
  });
}

function bindEvents() {
  $('#business-name').addEventListener('input', event => {
    state = updateProfile(state, 'name', event.target.value);
    renderPreview();
  });
  $('#business-description').addEventListener('input', event => {
    state = updateProfile(state, 'description', event.target.value);
    renderPreview();
  });
  $('#custom-color').addEventListener('input', event => {
    state = updateProfile(state, 'accent', event.target.value);
    syncInputs();
    renderPreview();
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-link-field="icon"]')) {
      state = updateLink(state, event.target.dataset.id, 'icon', event.target.value);
      renderPreview();
      notify('Ícone do link atualizado na prévia.');
    }
    if (event.target.name === 'accent' || event.target.name === 'button-style') {
      state = updateProfile(state, event.target.name === 'accent' ? 'accent' : 'style', event.target.value);
      syncInputs();
      renderPreview();
    }
    if (event.target.matches('[data-active]')) {
      state = updateLink(state, event.target.dataset.active, 'active', event.target.checked);
      event.target.closest('.link-card').classList.toggle('inactive', !event.target.checked);
      renderPreview();
      notify(event.target.checked ? 'Link ativado na prévia.' : 'Link desativado na prévia.');
    }
  });
  $('#link-editor').addEventListener('input', event => {
    const field = event.target.dataset.linkField;
    if (!field) return;
    state = updateLink(state, event.target.dataset.id, field, event.target.value);
    if (field === 'url') {
      const link = state.links.find(item => item.id === event.target.dataset.id);
      const hint = document.getElementById(`hint-${link.id}`);
      hint.textContent = urlError(link);
      hint.classList.toggle('error', Boolean(link.url && !validUrl(link.url)));
      event.target.setAttribute('aria-invalid', String(Boolean(link.url && !validUrl(link.url))));
    }
    renderPreview();
  });
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const control = target?.closest('button, a');
    if (!control) return;

    if (control.matches('[data-tab]')) changeTab(control.dataset.tab);
    if (control.matches('[data-open-links]')) changeTab('links', true);
    if (control.matches('[data-example]')) selectExample(control.dataset.example);
    if (control.matches('[data-load-sample]')) {
      selectExample(control.dataset.loadSample);
      $('#demonstracao').scrollIntoView({ behavior: scrollBehavior() });
      $('#demo-title').focus({ preventScroll: true });
    }
    if (control.id === 'reset-demo') {
      selectExample('restaurant', false);
      changeTab('profile');
      setView('phone');
      chosenPlan = null;
      $('#chosen-plan').hidden = true;
      notify(`Exemplo inicial de ${examples.restaurant.name} restaurado.`);
    }
    if (control.id === 'add-link') {
      state = addLink(state, `local-${crypto.randomUUID()}`);
      renderLinks();
      renderPreview();
      const last = state.links.at(-1);
      document.getElementById(`title-${last.id}`).focus();
      notify('Novo link adicionado. Informe o título e o endereço.');
    }
    if (control.matches('[data-remove]')) {
      const index = state.links.findIndex(link => link.id === control.dataset.remove);
      state = removeLink(state, control.dataset.remove);
      renderLinks();
      renderPreview();
      const next = state.links[Math.min(index, state.links.length - 1)];
      if (next) document.getElementById(`title-${next.id}`).focus();
      else $('#add-link').focus();
      notify('Link removido da prévia.');
    }
    if (control.matches('[data-move]')) {
      const id = control.dataset.id;
      const direction = control.dataset.move;
      state = moveLink(state, id, Number(direction));
      renderLinks();
      renderPreview();
      const moved = document.querySelector(`[data-id="${id}"][data-move="${direction}"]:not(:disabled)`);
      if (moved) moved.focus();
      else document.getElementById(`title-${id}`).focus();
      notify('Ordem dos links atualizada.');
    }
    if (control.matches('[data-view]')) setView(control.dataset.view);
    if (control.matches('[data-convert]')) {
      event.preventDefault();
      openDraft(control);
    }
    if (control.matches('[data-plan]')) {
      const plan = pricing.plans.find(item => item.id === control.dataset.plan);
      if (!plan) return;
      chosenPlan = plan;
      $('#chosen-plan').textContent = `Sua escolha: ${plan.name} · ${priceLabel(plan)}${priceSuffix(plan)}. A prévia continua gratuita, sem cobrança.`;
      $('#chosen-plan').hidden = false;
      $('#demonstracao').scrollIntoView({ behavior: scrollBehavior() });
      $('#demo-title').focus({ preventScroll: true });
    }
    if (control.id === 'download-draft') downloadDraft();
    if (control.matches('[data-close]')) closeConversion();
    if (control.matches('[data-start]')) {
      event.preventDefault();
      changeTab('profile');
      $('#demonstracao').scrollIntoView({ behavior: scrollBehavior() });
      $('#demo-title').focus({ preventScroll: true });
    }
    if (control.matches('[data-watch]')) {
      event.preventDefault();
      $('#demonstracao').scrollIntoView({ behavior: scrollBehavior() });
      $('#demo-title').focus({ preventScroll: true });
    }
    if (control.matches('[data-demo-link]')) {
      const link = state.links.find(item => item.id === control.dataset.demoLink);
      notify(isSampleUrl(link.url)
        ? 'Destino demonstrativo: este exemplo não abre uma página externa.'
        : 'Adicione um endereço válido no editor para abrir este link.');
    }
  });
  $('.editor-tabs').addEventListener('keydown', event => {
    const tabs = ['profile', 'links', 'style'];
    const index = tabs.indexOf(event.target.dataset.tab);
    if (index < 0) return;
    const next = event.key === 'ArrowRight' ? (index + 1) % 3
      : event.key === 'ArrowLeft' ? (index + 2) % 3
        : event.key === 'Home' ? 0
          : event.key === 'End' ? 2
            : null;
    if (next !== null) {
      event.preventDefault();
      changeTab(tabs[next], true);
    }
  });
  $('#interest-dialog').addEventListener('cancel', () => previousTrigger?.focus());
  $('#interest-dialog').addEventListener('click', event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeConversion();
  });
}

function initialize() {
  document.documentElement.style.setProperty('--accent', '#2845d6');
  document.documentElement.style.setProperty('--ink', '#14213d');
  document.documentElement.style.setProperty('--page', '#fafbfd');
  document.documentElement.style.setProperty('--soft', '#edf1ff');
  document.documentElement.style.setProperty('--hero', '#eaf0ff');
  const loginUrl = window.Vaynor.app?.loginUrl;
  if (loginUrl) document.querySelectorAll('[data-login]').forEach(link => { link.href = loginUrl; });
  document.title = `${brand.name} — Todos os caminhos do seu negócio`;
  document.querySelector('meta[name="description"]').content = 'Reúna pedidos, WhatsApp, redes sociais e serviços em uma página com a identidade do seu negócio. Experimente a demonstração da Vaynor.';
  syncInputs();
  renderLinks();
  renderPreview();
  bindEvents();
}

initialize();
})();
