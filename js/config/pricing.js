// Valores mensais escolhidos pelo responsável pelo produto em 09/10/2026.
// Este catálogo não concede direitos nem comprova uma contratação.
window.Vaynor = window.Vaynor || {};
window.Vaynor.pricing = {
  currency: 'BRL',
  plans: [
    { id: 'starter', name: 'Gratuito', amountCents: 0, audience: 'Para começar', description: 'Conheça a experiência e descubra como reunir seus canais.' },
    { id: 'standard', name: 'Essencial', amountCents: 1490, audience: 'Para a sua marca', description: 'Uma escolha para quem quer dar mais destaque à identidade do negócio.' },
    { id: 'business', name: 'Negócios', amountCents: 3990, audience: 'Para a sua empresa', description: 'Uma escolha para negócios que buscam ampliar sua presença digital.' }
  ]
};

window.Vaynor.priceLabel = plan => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: window.Vaynor.pricing.currency }).format(plan.amountCents / 100);
window.Vaynor.priceSuffix = plan => (plan.amountCents === 0 ? '' : '/mês');
