# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Histórico anterior a este arquivo: ver commits do repositório e o README.

## [Não lançado]
### Alterado
- `#contratar` deixou de ser "Duas formas de trabalhar comigo (PJ ou CLT)" e virou
  **"Como me contratar hoje"**: card **PJ · Contbit** com a janela declarada das
  **19h às 23h** e card de equipe com o contador **João Ricardo Abitante**, que cobre
  a rotina fora dessa janela. O card CLT saiu — a vaga já foi preenchida.
- CSS `.hire-card.clt` renomeado para `.hire-card.dupla`.
- Alinhados ao novo posicionamento: `<title>`, meta description, keywords, OpenGraph,
  Twitter Card, faixa de CTA, seção de contato, placeholder do formulário, menu mobile,
  botão do hero, card "Consultoria" e parágrafo do Sobre.
- Removida a última menção a "PJ ou CLT", que ainda restava na linha do tempo
  (marco de 10/07/2026). O site não fala mais em vaga de empresa em lugar nenhum.
- Card do **João Ricardo Abitante** com os dados reais de jrabitante.com.br:
  **CRC-1SP 139213**, serviços (abertura e regularização de CNPJ, contabilidade
  mensal, Simples Nacional, folha/pró-labore/INSS, planejamento tributário, IRPF e
  IRPJ) e atendimento digital em todo o estado de São Paulo, com link para o site.
- `README.md` atualizado com o cargo atual e a composição da Contbit.

### Corrigido
- `</article>` órfã na seção de portfólio (bug anterior a esta entrega): o HTML
  tinha 10 aberturas para 11 fechamentos.

## [Não lançado]
### Adicionado
- Seção **Caldeira OTC** (`#caldeira`): contratação como **Analista Financeiro** na
  Caldeira Negócios (mesa de balcão de Bitcoin), foto com o uniforme da empresa
  (JPEG 660×883 embutido em base64), **linha do tempo** de 2016 até o "sim"
  (03/08/2026) e o primeiro dia de trabalho (05/08/2026), e um texto de
  **intraempreendedorismo para pessoas autistas**.
- Link "Caldeira OTC" no menu (desktop e mobile) e badge no bloco Sobre.

### Alterado
- Faixa do topo deixou de anunciar disponibilidade e passou a anunciar a contratação
  (agora é link para `#caldeira`).
- JSON-LD `Person`: `worksFor` (Caldeira Negócios), `jobTitle` e `description`
  atualizados com o novo cargo.

## [Anterior]
- Sitemap continha 11 URLs de outros domínios (rejeitadas pelo Search Console como
  "URL não permitida") e o próprio domínio duplicado. Agora lista só as 3 URLs deste
  host; os demais projetos seguem descobertos pelos links da página.

## [Não lançado]
### Adicionado
- Card e dados estruturados da **Matriz de Risco PLD/FT** (kyc.contbit.tax) no portfólio.
## [Não lançado]
### Adicionado
- `AGENTS.md` e `CLAUDE.md` com contexto do projeto para assistentes de IA.
- Este `CHANGELOG.md`.
