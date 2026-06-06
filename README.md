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
