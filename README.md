# João Abitante Ventures

> **Hospedagem:** **Vercel**, com deploy automático a cada push na `main`.
> Cloudflare, se usada, é apenas DNS (proxy cinza). Este projeto **não** faz deploy no Cloudflare Workers/Pages.

Site institucional / portfólio de **João Carlos Bueno Abitante** — contador CRC-SP com 10+ anos, TaxTech construído com IA. Desde 05/08/2026, **Analista Financeiro na Caldeira OTC**; atende como **PJ** pela Contbit na janela das **19h às 23h**, ao lado do contador **João Ricardo Abitante** (CRC-1SP 139213, [jrabitante.com.br](https://jrabitante.com.br/)).

Posicionamento: vender o perfil para fintechs, escritórios e grandes empresas (compliance, tributário, produto TaxTech).

**No ar:** https://joao.abitante.net/
**Diretório de sites:** https://joao.abitante.net/sites.html
**Segurança:** [SECURITY.md](SECURITY.md) · **Histórico:** [CHANGELOG.md](CHANGELOG.md) · **Contexto para IAs:** [AGENTS.md](AGENTS.md)

Página única, sem frameworks e sem dependências externas (HTML + CSS + JavaScript puro). A foto está embutida no próprio arquivo, então **`index.html` é tudo que o site precisa para funcionar**, inclusive offline.

## Arquivos

- `index.html` — o site completo (único arquivo necessário).
- `sites.html` — diretório canônico de todos os sites e produtos (JSON-LD `ItemList`).
- `llms.txt` — a mesma lista em texto, para assistentes de IA.
- `sitemap.xml` e `robots.txt` — só URLs deste host; libera buscadores e bots de IA.
- `vercel.json` — cabeçalhos HTTP de segurança aplicados pela Vercel (CSP, HSTS, X-Frame-Options, Permissions-Policy…).
- `_headers` — os mesmos cabeçalhos no formato Cloudflare Pages/Netlify; a Vercel ignora este arquivo, ele fica só como referência.
- `i.html` + `i.js` — link curto de indicação que abre o WhatsApp (`/i.html?n=Nome&p=a`), sem indexação.
- `referral.css` + `referral.js` — widget "Indique e receba" da seção `#indicar`.
- `og-image.png` (1200×630), `favicon.ico`, `favicon.png`, `favicon-64.png`, `apple-touch-icon.png` — imagens de compartilhamento e ícones.
- `google88964d13e2d5b34f.html` — verificação do Google Search Console.
- `.nojekyll` — resquício do GitHub Pages; inofensivo na Vercel.

## Como publicar

1. Trabalhe em branch (`fix/descricao-curta`) e abra PR para a `main`.
2. Ao fazer merge na `main`, a Vercel publica sozinha em https://joao.abitante.net/.
3. Nunca rode `vercel --prod` à mão nem edite nada no painel da Vercel: o GitHub é a única fonte da verdade.

Cada push em outra branch gera um deploy de preview (protegido por login da Vercel) para conferir antes do merge.

## Atualizações comuns

- **Portfólio:** cada produto aparece em quatro lugares — card em `#projetos` e JSON-LD de `index.html`, lista e JSON-LD de `sites.html`, e `llms.txt`. Mantenha os quatro iguais e ajuste o `numberOfItems` de `sites.html`.
- **Cargo atual:** `#caldeira` (texto e `figcaption`), a faixa `.avail-banner` do hero, o badge em "Sobre" e o `worksFor`/`jobTitle` do JSON-LD `Person`.
- **E-mail do formulário:** procure por `mailto:contbit@gmail.com` e ajuste se necessário.
- **Trocar a foto:** a imagem está embutida em base64 dentro da tag `<img>` na seção "Sobre". Para trocar, gere o base64 da nova foto e substitua o conteúdo de `src`. O mesmo vale para a foto da seção `#caldeira` (`.nc-card .photo img`) — otimize antes (JPEG ~660 px de largura, qualidade 82) para não inflar o `index.html`.
- **Datas:** ao mudar conteúdo, atualize o `lastmod` do `sitemap.xml`, o "Atualizado em" de `sites.html` e registre no `CHANGELOG.md`.

## Segurança e privacidade

Esta página foi endurecida para que **nenhum perfil de visitante possa ser montado a partir de metadados**:

- **Zero requisições externas.** Fontes, foto, ícone e texturas estão embutidos no próprio arquivo. A página não chama Google Fonts nem qualquer CDN — portanto nenhum terceiro recebe IP, User-Agent ou Referer do visitante.
- **Zero cookies / localStorage / sessionStorage.** Nada é gravado no navegador.
- **Zero analytics, pixels, beacons ou fingerprinting.**
- **Content-Security-Policy** restritiva no documento e no cabeçalho HTTP: `default-src 'none'` com `connect-src 'none'` — bloqueia qualquer tentativa de exfiltração de dados pela rede.
- **Referrer-Policy: no-referrer** e todos os links externos com `rel="noopener noreferrer"` — ao clicar em WhatsApp/LinkedIn/projetos, o destino não descobre que o visitante veio deste site.
- **Formulário de contato via `mailto:`** — abre o e-mail do próprio visitante; nenhum dado é enviado ou armazenado em servidor.
- **`vercel.json`** adiciona, no servidor, CSP completa, HSTS, X-Frame-Options, Permissions-Policy (com opt-out de `browsing-topics`/`interest-cohort`, as APIs de perfilamento do Google), COOP e CORP.

### Importante sobre o host
- A Vercel só aplica cabeçalhos definidos em `vercel.json`. O arquivo `_headers` (formato Cloudflare Pages/Netlify) é ignorado lá e existe apenas como referência caso o site mude de host.
- Qualquer host registra o **IP do visitante** nos logs de conexão (inerente à web). A página em si não entrega esse dado a terceiros.

## SEO e compartilhamento
- `og-image.png` (1200×630) é a imagem que aparece quando o link é compartilhado no WhatsApp, LinkedIn, X, etc.
- `sitemap.xml` lista só as URLs deste host (o Search Console rejeita domínios de terceiros); já está referenciado no `robots.txt`.
- O `<title>`, a descrição e o Schema.org (Person) usam o nome completo **João Carlos Bueno Abitante** (com `alternateName` "João Abitante") para o site ser encontrado em buscas pelo nome.
- O domínio está registrado no **Google Search Console** (arquivo de verificação na raiz); reenvie o `sitemap.xml` depois de mudanças grandes.
