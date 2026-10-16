window.Vaynor = window.Vaynor || {};
window.Vaynor.examples = {
  restaurant: {
    id: 'restaurant', name: 'Bifrost Burger', description: 'Seu próximo banquete começa aqui. Peça, fale com a gente e acompanhe as novidades.', initials: 'BB', tagline: 'HAMBÚRGUERES • DELIVERY', accent: '#2845D6', style: 'rounded',
    links: [
      { id: 'restaurant-orders', title: 'Faça seu pedido', subtitle: 'Nosso cardápio na palma da mão', url: 'https://bifrostburger.saipos.com/home', icon: 'store', active: true },
      { id: 'restaurant-social', title: 'Siga no Instagram', subtitle: 'Novidades que dão fome', url: 'https://www.instagram.com/bifrostburger/', icon: 'instagram', active: true },
      { id: 'restaurant-contact', title: 'Converse no WhatsApp', subtitle: 'Vamos ajudar você', url: 'https://wa.me/5511940822165', icon: 'message', active: true }
    ]
  },
  professional: {
    id: 'professional', name: 'Marina Costa', description: 'Design para marcas que querem se conectar. Conheça meu trabalho e vamos conversar.', initials: 'MC', tagline: 'DESIGN • ESTRATÉGIA', accent: '#096B62', style: 'outline',
    links: [
      { id: 'professional-portfolio', title: 'Conheça meu portfólio', subtitle: 'Projetos e processos', url: 'https://example.com/portfolio', icon: 'briefcase', active: true },
      { id: 'professional-services', title: 'Explore meus serviços', subtitle: 'Como posso ajudar sua marca', url: 'https://example.com/servicos', icon: 'sparkles', active: true },
      { id: 'professional-contact', title: 'Vamos conversar', subtitle: 'Conte sua ideia', url: 'https://example.com/contato', icon: 'message', active: true }
    ]
  },
  creator: {
    id: 'creator', name: 'Lucas em Cena', description: 'Criatividade, bastidores e ideias em movimento. Encontre meu conteúdo por aqui.', initials: 'LC', tagline: 'VÍDEOS • CRIATIVIDADE', accent: '#7A32A8', style: 'pill',
    links: [
      { id: 'creator-video', title: 'Assista ao último vídeo', subtitle: 'Uma ideia nova para o seu dia', url: 'https://example.com/video', icon: 'play', active: true },
      { id: 'creator-social', title: 'Acompanhe os bastidores', subtitle: 'Conteúdo além da câmera', url: 'https://example.com/social', icon: 'instagram', active: true },
      { id: 'creator-projects', title: 'Projetos e parcerias', subtitle: 'Vamos criar algo juntos', url: 'https://example.com/projetos', icon: 'briefcase', active: true }
    ]
  }
};
window.Vaynor.accentOptions = [
  { value: '#2845D6', label: 'Azul' }, { value: '#096B62', label: 'Verde' },
  { value: '#7A32A8', label: 'Violeta' }, { value: '#A83A20', label: 'Terracota' }, { value: '#182640', label: 'Marinho' }
];
