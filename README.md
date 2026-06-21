# João Abitante Ventures

Site institucional de João Carlos Bueno Abitante — Compliance, Bitcoin, Inteligência Artificial e Impacto Social.

Página única, sem frameworks e sem dependências obrigatórias externas (HTML + CSS + JavaScript puro). A foto está embutida no próprio arquivo, então **`index.html` é tudo que o site precisa para funcionar**, inclusive offline.

## Arquivos

- `index.html` — o site completo (único arquivo necessário).
- `.nojekyll` — diz ao GitHub Pages para servir os arquivos sem processá-los (recomendado).
- `robots.txt` — libera a indexação por buscadores.
- `README.md` — este arquivo.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex.: `joaoabitante-ventures`).
2. Envie os arquivos para a raiz do repositório (arraste-os na opção **Add file > Upload files**, ou use git).
3. No repositório, vá em **Settings > Pages**.
4. Em **Build and deployment > Source**, selecione **Deploy from a branch**.
5. Escolha a branch **main** e a pasta **/ (root)**. Salve.
6. Aguarde alguns minutos. O endereço aparecerá no topo da página de Pages, no formato:
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

Dica: para o site abrir na raiz `https://SEU-USUARIO.github.io/`, nomeie o repositório como `SEU-USUARIO.github.io`.

## Como publicar no Cloudflare Pages (alternativa)

1. Em **Cloudflare > Workers & Pages > Create > Pages**, conecte o repositório do GitHub.
2. Em build, deixe o comando de build **vazio** e o diretório de saída como **/** (a raiz).
3. Faça o deploy.

## Domínio próprio (opcional)

Se for usar um domínio (ex.: `joaoabitante.com`):

1. Aponte o DNS para o GitHub Pages ou Cloudflare Pages.
2. Configure o domínio em **Settings > Pages > Custom domain** (GitHub) — isso cria um arquivo `CNAME` no repositório.
3. Atualize no `index.html` as URLs de `canonical`, `og:url` e do `sitemap` (se criar um) para o seu domínio real. Hoje elas usam `https://joaoabitante.com/` como exemplo.

## Atualizações comuns

- **Contador de visualizações:** procure por `data-target="68358"` no `index.html` (aparece duas vezes) e troque o número.
- **E-mail do formulário:** procure por `mailto:contbit@gmail.com` e ajuste se necessário.
- **Trocar a foto:** a imagem está embutida em base64 dentro da tag `<img>` na seção "Sobre". Para trocar, gere o base64 da nova foto e substitua o conteúdo de `src`.

## Segurança e privacidade

Esta página foi endurecida para que **nenhum perfil de visitante possa ser montado a partir de metadados**:

- **Zero requisições externas.** Fontes, foto, ícone e texturas estão embutidos no próprio arquivo. A página não chama Google Fonts nem qualquer CDN — portanto nenhum terceiro recebe IP, User-Agent ou Referer do visitante.
- **Zero cookies / localStorage / sessionStorage.** Nada é gravado no navegador.
- **Zero analytics, pixels, beacons ou fingerprinting.**
- **Content-Security-Policy** restritiva no documento: `default-src 'none'` com `connect-src 'none'` — bloqueia qualquer tentativa de exfiltração de dados pela rede.
- **Referrer-Policy: no-referrer** e todos os links externos com `rel="noopener noreferrer"` — ao clicar em WhatsApp/LinkedIn/projetos, o destino não descobre que o visitante veio deste site.
- **Formulário de contato via `mailto:`** — abre o e-mail do próprio visitante; nenhum dado é enviado ou armazenado em servidor.
- **`_headers`** (aplicado no Cloudflare Pages/Netlify) adiciona CSP completa, HSTS, X-Frame-Options, Permissions-Policy (com opt-out de `browsing-topics`/`interest-cohort`, as APIs de perfilamento do Google), COOP e CORP.

### Importante sobre o host
- O **GitHub Pages não permite cabeçalhos HTTP customizados**, então o arquivo `_headers` é ignorado lá. Nesse caso valem apenas o CSP e o referrer embutidos via `<meta>` (que já bloqueiam o essencial, pois a página não faz requisições externas). Para a proteção completa de cabeçalhos (HSTS, frame-ancestors, Permissions-Policy), publique no **Cloudflare Pages**, que respeita o `_headers`.
- Qualquer host registra o **IP do visitante** nos logs de conexão (inerente à web). A página em si não entrega esse dado a terceiros; para minimizar, prefira Cloudflare Pages com Web Analytics sem cookies.
