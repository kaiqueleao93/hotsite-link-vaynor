# Hotsite Vaynor

## Estrutura

- `index.html`: conteúdo semântico e metadados SEO, disponível antes da execução do JavaScript.
- `css/styles.css`: estilos responsivos e identidade visual.
- `js/app.js`: interações da demonstração.
- `js/config/`, `js/data/` e `js/lib/`: identidade, preços, exemplos e funções reutilizáveis.
- `assets/img/`: recursos visuais.

Os preços exibidos no HTML ficam disponíveis para mecanismos de busca sem depender do JavaScript. Mantenha os valores em `js/config/pricing.js` em sincronia com a seção `#planos` do `index.html`.

A URL da tela de login do sistema (botão "Entrar" do topo) fica em `js/config/app.js`, na propriedade `loginUrl`.

## Visualização local

Sirva a pasta por HTTP:

```sh
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`. A demonstração também funciona abrindo `index.html` diretamente no navegador.

## Publicação

O site é publicado em `https://link.vaynor.com.br/` pelo GitHub Pages. O workflow `.github/workflows/deploy.yml` roda a cada push na branch `main` e também pode ser disparado manualmente na aba Actions. Ele verifica a sintaxe do JavaScript e publica apenas `index.html`, `css/`, `js/` e `assets/`.

Configuração única no GitHub:

1. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions** como fonte.
2. Em **Custom domain**, informe `link.vaynor.com.br` e ative **Enforce HTTPS** depois que o certificado for emitido.
3. No DNS, aponte `link.vaynor.com.br` com um registro `CNAME` para `<usuario-ou-org>.github.io`.

A rota `/login` é tratada pelo proxy do sistema, não pelo hotsite.
