# Segurança e contato — João Abitante Ventures

**Ao vivo:** https://joaoabitante.github.io/abitanteventures/  
**Canônico:** https://joao.abitante.net/

## Como alguém entra em contato (canais oficiais)

Estes dados **precisam** estar públicos — é o portfólio. Não é vazamento.

| Canal | Como | Link / valor |
|-------|------|----------------|
| **E-mail profissional** | Clique ou copie | `joao.abitante.contabeis@gmail.com` |
| **E-mail ContBit / projetos** | Clique ou copie | `contbit@gmail.com` |
| **Telefone** | Ligar (`tel:`) | +55 11 99410-5856 |
| **WhatsApp** | App / web | [wa.me/5511994105856](https://wa.me/5511994105856) |
| **Formulário do site** | Abre o **e-mail do visitante** com assunto/corpo preenchidos (`mailto:`) — nada é enviado a um servidor nosso |
| **LinkedIn** | Perfil | /in/joaocarlos1 |
| **Instagram** | @teaempreende | |

O site **não** tem chat embutido, CRM nem backend de mensagens. Quem preenche o formulário usa o próprio cliente de e-mail.

---

## Headers de segurança: o que o GitHub faz e o que não faz

### Limitação importante

O **GitHub Pages não aplica** o arquivo `_headers` (isso é recurso de **Cloudflare Pages / Netlify**).

No `github.io` a proteção real vem de:

1. **Meta CSP** e **Referrer-Policy** dentro do `index.html` (já no ar)
2. HSTS do domínio `github.io` (do próprio GitHub)

### O que a CSP do HTML garante (também no GitHub Pages)

- `connect-src 'none'` — a página **não** pode chamar APIs, analytics nem pixels
- `default-src 'none'` + allowlist mínima (só script/style inline, imagens self/data)
- `form-action 'none'` — formulário HTML não posta para servidor; o JS usa `mailto:`
- Sem cookies, localStorage, fetch, XHR, Google Fonts, CDNs

### O que o arquivo `_headers` adiciona (quando o host respeita)

Use no **Cloudflare Pages** (recomendado para `joao.abitante.net`):

- CSP completa com `frame-ancestors 'none'`
- `X-Frame-Options: DENY`
- `Permissions-Policy` (opt-out Topics/FLoC)
- COOP / CORP
- HSTS longo
- NEL/Report-To zerados (anti-telemetria CDN)

Arquivo no repo: [`_headers`](_headers)

### Páginas necessárias

| Site | Host | Headers |
|------|------|---------|
| Portfólio Ventures | GitHub Pages + (opcional) Cloudflare | Meta CSP no HTML + `_headers` para CF |
| Prêmio Cripto | Cloudflare (`premio.elisaofiscal.net`) | `_headers` no edge + meta CSP no HTML |

---

## Privacidade do visitante

- Zero analytics / pixels / fingerprinting no código
- Links externos com `rel="noopener noreferrer"`
- IP do visitante ainda aparece nos logs do **host** (GitHub/Cloudflare) — inerente à web

## Reportar vulnerabilidade

Contato pelos e-mails da tabela acima. Não abra issue pública com exploit detalhado.
