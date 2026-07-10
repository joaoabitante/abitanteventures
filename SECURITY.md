# Segurança — João Abitante Ventures (portfólio)

**Última revisão:** 2026-07-10  
**Repo:** público (portfólio institucional)  
**Live (GitHub Pages):** https://joaoabitante.github.io/abitanteventures/  
**Domínio canônico no HTML:** https://joao.abitante.net/

## Modelo

Página única (`index.html`), **sem backend**, **sem analytics**, **sem cookies/storage**, **sem CDN**.  
Foto, fontes e ícone embutidos. `connect-src 'none'` na CSP impede qualquer chamada de rede pela página.

## Resultado da auditoria (2026-07-10)

| Controle | Status |
|----------|--------|
| localStorage / sessionStorage / cookies | Ausentes |
| fetch / XHR / eval | Ausentes |
| Google Analytics / gtag / pixels | Ausentes |
| CDNs / Google Fonts | Ausentes |
| Links `target=_blank` com `noopener noreferrer` | 28/28 OK |
| CSP meta (`connect-src 'none'`) | OK |
| Form contato | `preventDefault` + `mailto:` (sem servidor) |
| `_headers` (CSP, HSTS, COOP, CORP, Permissions-Policy) | Presente — **só aplicado no Cloudflare/Netlify**, não no GitHub Pages |
| Wiki do repo | Desligada |

### Dados pessoais intencionais no HTML/JSON-LD

O portfólio **publica de propósito** (contato profissional):

- e-mails (`joao.abitante.contabeis@gmail.com`, `contbit@gmail.com`)
- telefone (+55 11 99410-5856)
- LinkedIn / redes / CRC

Isso **não é vazamento acidental**; é SEO e contato. Se quiser menos exposição, remova `telephone`/`email` do JSON-LD e deixe só formulário mailto.

### Limitações do GitHub Pages

O host **não envia** o arquivo `_headers`. No ar em `github.io` valem:

- CSP e Referrer-Policy via **meta** no HTML (já suficientes para bloquear exfiltração pela página)
- HSTS do domínio `github.io` (do GitHub)

**Não** chegam via Pages: `X-Frame-Options`, `Permissions-Policy` HTTP, NEL cancel, etc.

**Recomendação:** publicar também (ou só) no **Cloudflare Pages** com o mesmo repo para headers completos e domínio `joao.abitante.net`, com Web Analytics/RUM **desligados**.

### O que o visitante ainda pode revelar (inerente)

- IP nos logs do host (GitHub/Cloudflare)
- Ao clicar em links externos (LinkedIn, WhatsApp, projetos), o **destino** vê o IP — o site usa `rel="noreferrer"` para não vazar a URL de origem

## Como reportar

Issues privadas ou contato pelo e-mail do portfólio. Não publicar exploits detalhados em issue pública.
