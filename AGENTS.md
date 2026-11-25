# AGENTS.md — Iara Dhenniffy · Psicóloga

Guia de trabalho para qualquer agente de IA (Claude, Codex, Cursor etc.) neste repositório. **Leia este arquivo inteiro antes de qualquer alteração.**

## 1. Visão geral do projeto

Landing page da psicóloga **Iara Dhenniffy**, que atende **exclusivamente online**.

| Item | Valor |
| --- | --- |
| Nome de exibição | Iara Dhenniffy — Psicóloga |
| Registro | CRP 15/5286 |
| Cadastro e-Psi (atendimento online) | TODO: confirmar com o CRP-15 se o cadastro ainda é exigido depois da Res. CFP 9/2024 e, se for, se está ativo |
| Apresentação (bio) | "Psicóloga autista · TDAH · TOC · Bipolaridade" / "Atendo neurodivergentes e outras mentes fora do padrão" |
| Serviço | Psicoterapia (terapia) individual online |
| Público | Pessoas neurodivergentes (autismo, TDAH, TOC, transtorno bipolar) e "outras mentes fora do padrão" |
| Faixa etária atendida | TODO: adultos? adolescentes? (menores exigem consentimento dos responsáveis) |
| Abordagem teórica | TODO: ex.: TCC, ACT, Análise do Comportamento, Psicanálise |
| Área de atendimento | Todo o Brasil (e brasileiros no exterior, se confirmado), por videochamada |
| Idioma | Português do Brasil (pt-BR) |
| Objetivo do site | Fazer a pessoa neurodivergente se sentir vista, entendida e segura, explicar como funciona a terapia online e levar ao contato para agendar (WhatsApp TODO) |
| Tom | Acolhedor, direto, honesto e neuroafirmativo. A Iara fala de dentro: ela mesma é autista. Linguagem clara e literal, frases curtas, sem jargão clínico desnecessário, sem metáforas confusas e sem tom de "cura" ou "consertar" |

### Conceito

O ponto forte da marca é a **identificação**: uma psicóloga autista que atende mentes fora do padrão. O site deve comunicar "aqui você não precisa mascarar". Ideias de copy (ajuste e confirme com o usuário): "Um espaço onde a sua mente não precisa caber no padrão."; "Terapia feita por quem também é neurodivergente."

O diferencial do projeto são as **animações de scroll**, que vêm do site de referência clonado em `src/clone`. Elas continuam sendo prioridade, mas com um cuidado a mais: o público tem alta sensibilidade sensorial. As animações devem ser **fluidas, calmas e previsíveis**, nunca piscando, tremendo ou girando, e o visitante precisa poder desligá-las com um clique (ver seção 4).

## 2. Stack e convenções

- **Angular** (versão do `package.json`, não faça downgrade nem upgrade de versão maior sem pedir) com TypeScript em modo `strict`.
- **Standalone components** em tudo. Nada de `NgModule`.
- **Signals** (`signal`, `computed`, `input()`, `output()`) para estado e entradas. Use `inject()` em vez de injeção pelo construtor.
- **Control flow nativo** (`@if`, `@for`, `@defer`). Não use `*ngIf`/`*ngFor`.
- `ChangeDetectionStrategy.OnPush` em todos os componentes.
- **SSR e prerender** com `@angular/ssr` (se ainda não estiver instalado: `ng add @angular/ssr`) e prerender da rota `/`. Isso é obrigatório para o SEO.
- Estilos em **SCSS**, com design tokens em CSS custom properties (`src/styles/_tokens.scss`). Sem Bootstrap ou Tailwind, a não ser que o usuário peça.
- Imagens com `NgOptimizedImage` (`ngSrc`, `width`/`height` ou `fill`, `priority` só na imagem do hero), em WebP/AVIF e com `srcset` responsivo.
- Nomes de arquivos em kebab-case. Nomes de classes, variáveis e código em inglês. **Todo o texto visível em português.**
- Não adicione dependências sem justificar. Bibliotecas de animação são aceitas só se o clone já usar a mesma (ver seção 4).

### Estrutura de pastas esperada

```
src/
├── app/
│   ├── core/
│   │   ├── animations/        # serviço, diretivas de scroll e MotionPreferenceService
│   │   ├── seo/               # SeoService, JSON-LD
│   │   └── data/              # conteúdo do site tipado (site-content.ts)
│   ├── sections/              # hero, about, who-i-help, how-it-works, online-therapy, approach, faq, contact
│   ├── shared/                # header, footer, botões, whatsapp-fab, crisis-notice, ícones
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── clone/                     # SOMENTE REFERÊNCIA, nunca entra no bundle
├── styles/                    # _tokens.scss, _typography.scss, _reset.scss, _mixins.scss
└── styles.scss
public/                        # fotos da Iara, logo (se houver), favicon, og-image, robots.txt, sitemap.xml
docs/
└── clone-analysis.md          # gerado pelo agente na Fase 0
```

## 3. A pasta `src/clone` (referência)

`src/clone` tem a cópia de um site de referência baixado com o vibecloner. Regras:

1. **Só para estudo.** Nunca importe, referencie ou empacote arquivos de `src/clone` no app. Garanta que ela fique fora do build:
   - em `tsconfig.app.json`: `"exclude": ["src/clone/**"]`;
   - não inclua `src/clone` em `assets` nem em `styles` no `angular.json`.
2. Aproveite **apenas o comportamento de movimento e de interação**: timings, easings, sequências, padrões de scroll (pin, parallax, reveal, split text, máscara de imagem, scrub, scroll horizontal, troca de cor de fundo, zoom, marquee, smooth scroll, loader, transições de menu e hovers).
3. **Não copie a identidade** do site original: nenhum texto, imagem, logo, fonte licenciada, nome ou layout idêntico de marca.
4. Antes de programar qualquer seção, gere `docs/clone-analysis.md` (ver `PROMPT.md`, Fase 0).
5. Código minificado ou empacotado do clone deve ser **reescrito** em TypeScript limpo e tipado, sem colar blocos minificados.

## 4. Animações de scroll (prioridade, com cuidado sensorial)

### Arquitetura

- Centralize tudo em `src/app/core/animations/`:
  - `scroll-animation.service.ts`: inicializa a biblioteca (ex.: GSAP + ScrollTrigger, Lenis), registra plugins, faz o refresh e expõe utilitários;
  - `motion-preference.service.ts`: um signal `motionEnabled` que segue o `prefers-reduced-motion` do sistema. Todas as diretivas leem esse signal e reagem a mudanças em tempo real (desligar → `ctx.revert()` e o conteúdo fica estático e visível; religar → recria as animações);
  - **diretivas reutilizáveis** aplicadas no template, por exemplo `appReveal`, `appParallax`, `appSplitText`, `appPinSection`, `appImageMask`, `appHorizontalScroll`, `appBgShift`, `appDrawSvg`. Cada padrão encontrado no clone vira uma diretiva configurável por `input()`.
- Se o clone usar GSAP/ScrollTrigger/Lenis/Locomotive, use a **mesma** lib via npm (versão atual, licença compatível). Se usar animação própria com IntersectionObserver ou CSS, reimplemente da mesma forma, sem lib extra.

### Controle de movimento (obrigatório)

- O site segue automaticamente o `prefers-reduced-motion` do sistema, em tempo real. **Não há botão "Reduzir movimento"** (removido a pedido): não recrie.
- A preferência é aplicada **antes** da primeira animação (script inline do `index.html`), para evitar "flash" de movimento. Nada é salvo no navegador.
- Com movimento reduzido: sem parallax, pin, scrub, scroll horizontal, marquee, zoom, desenho de SVG e smooth scroll (rolagem nativa). Permitido apenas um fade curto (≤ 200ms) ou nada.

### Diretrizes sensoriais

- **Proibido:** piscar ou estroboscópio, tremer (shake), girar continuamente, autoplay de vídeo com som, cursor que "persegue" o mouse com atraso exagerado, mudanças bruscas de cor ou de contraste, elementos que se movem sozinhos sem o usuário rolar (exceto um marquee lento e pausável).
- **Preferir:** fades e deslocamentos curtos (≤ 40px), easings suaves (`power2.out`, `expo.out` moderado), durações de 0,6–1s, stagger leve, troca de cor de fundo gradual entre tons próximos.
- Loader/intro: só se o clone tiver, ≤ 1s, sem loop, uma vez por sessão, e pulado se o movimento estiver reduzido.
- O conteúdo nunca deve ficar "preso" atrás de uma animação: se a pessoa rolar rápido, o texto precisa estar legível.

### Regras técnicas

- **Compatível com SSR:** nenhum acesso a `window`, `document`, `localStorage` ou `gsap` no servidor. Inicialize com `afterNextRender()` ou proteja com `isPlatformBrowser()`.
- **Fora da zona do Angular:** rode loops e listeners de scroll dentro de `NgZone.runOutsideAngular()`.
- **Limpeza:** todo ScrollTrigger, timeline, observer e instância do Lenis é destruído no `DestroyRef.onDestroy` (use `gsap.context()` + `ctx.revert()`).
- **Conteúdo visível sem JS:** o estado inicial "escondido" só pode ser aplicado depois que o JS iniciar (ex.: classe `.js-anim` no `<html>`).
- **Desempenho:** anime só `transform` e `opacity` (e `clip-path`/`stroke-dashoffset` quando necessário). Meta: 60 fps num celular intermediário. O público chega principalmente pelo Instagram, no celular.
- **Sem CLS:** reserve o espaço dos elementos animados com `aspect-ratio`.
- **Mobile:** simplifique abaixo de 768px (pins longos e scroll horizontal viram reveals simples).
- **Âncoras:** os links do menu rolam até a seção certa, compensando o header fixo, e o foco vai para a seção.
- Recalcule os gatilhos depois que imagens e fontes carregarem (`ScrollTrigger.refresh()`).

## 5. Design

- **Direção de arte:** calma, humana, contemporânea e "segura sensorialmente". Previsível e organizada: layout consistente, seções bem delimitadas, hierarquia clara, muito respiro, sem poluição visual (nada de excesso de ícones, badges, pop-ups ou banners de cookie gigantes).
- **Paleta:** se houver logo ou identidade em `public/`, extraia dela. Caso contrário, proponha uma paleta de baixa saturação e contraste confortável (ex.: off-white quente, um verde-sálvia ou azul acinzentado suave, um terracota ou lilás discreto de destaque, texto em grafite em vez de preto puro). Nada de branco puro com preto puro em grandes áreas, nem cores neon. Mostre a paleta ao usuário na Fase 0.
- **Simbologia:** **não use a peça de quebra-cabeça** (é rejeitada por grande parte da comunidade autista). Se quiser um símbolo de neurodiversidade, prefira o **infinito** (dourado ou em espectro suave), e somente se o usuário aprovar. Evite também cérebros "coloridos e caóticos" e imagens de pessoas com a mão na cabeça (estereótipo de sofrimento).
- **Tipografia:** priorize legibilidade: uma sans humanista com formas de letra bem distintas (ex.: Atkinson Hyperlegible, Lexend, Nunito Sans ou Inter) para o texto, e para títulos a mesma família em peso maior ou uma serifada suave (ex.: Fraunces). Corpo de texto de 17–18px, altura de linha 1,6–1,7, linhas de no máximo ~70 caracteres, texto alinhado à esquerda (nunca justificado), sem itálico em blocos longos, `font-display: swap` e fontes locais.
- **Imagens:** use somente as de `public/`. Liste os arquivos antes de usar e escolha cada foto pela função. Nunca invente caminhos. Fotos reais da Iara valem mais que banco de imagens.
- **Responsividade total:** teste em 320, 375, 414, 768, 1024, 1280, 1440, 1920 e 2560px. Mobile-first. Áreas de toque com no mínimo 44×44px. Sem rolagem horizontal involuntária.

## 6. Conteúdo e ética do CFP (obrigatório)

A divulgação segue o **Código de Ética Profissional do Psicólogo (Res. CFP 010/2005)**, a **Res. CFP 9/2024** (serviços psicológicos mediados por tecnologia; revogou a 11/2018) e o Código de Defesa do Consumidor.

### Identificação obrigatória (rodapé e seção de contato)

- **Iara Dhenniffy — Psicóloga — CRP 15/5286**
- Menção ao cadastro no **e-Psi**, com link para https://e-psi.cfp.org.br/ (consulta pública de cadastro), **só depois de o usuário confirmar com o CRP-15 que o cadastro ainda é exigido (Res. CFP 9/2024) e está ativo.** Até lá, o site não menciona o e-Psi.

### Proibido

- prometer resultado, cura ou prazo ("supere a ansiedade em 8 sessões", "controle total do TDAH");
- usar o preço como propaganda (valores, descontos, "primeira sessão grátis", pacotes promocionais);
- linguagem sensacionalista ou autopromoção em detrimento de outros profissionais;
- **depoimentos de pacientes:** por sigilo e pela ética profissional, não inclua depoimentos, mesmo que o usuário forneça, sem antes alertá-lo para confirmar com o CRP-15;
- oferecer serviços que exigem formação ou registro não informados: **diagnóstico/laudo, avaliação neuropsicológica, teste de autismo/TDAH** só entram se o usuário confirmar a habilitação;
- sugerir que a psicóloga prescreve medicação (isso é atribuição médica).

### Linguagem neuroafirmativa

- Use **"pessoa autista"** ou **"autista"** (preferência da comunidade e da própria Iara), "neurodivergente", "TDAH", "pessoa com TOC", "pessoa com transtorno bipolar". **Evite** "portador", "sofre de autismo", "doença", "cura", "normal × anormal" e "grau leve/grave".
- A expressão **"mentes fora do padrão"** é da própria Iara: use como assinatura da marca.
- Trate autismo e TDAH como formas de funcionamento, e TOC e bipolaridade como condições de saúde mental que merecem cuidado, sem patologizar a neurodivergência nem minimizar o sofrimento.
- A identidade autista da Iara é um dado público da bio; use com orgulho e naturalidade, sem transformá-la em "história de superação".

### Aviso de crise (obrigatório)

O atendimento online não é serviço de urgência. Inclua, de forma discreta mas visível (rodapé e seção de contato):

> "Este espaço não oferece atendimento de urgência. Em situação de crise, ligue **188** (CVV, 24h e gratuito) ou **192** (SAMU), ou procure a emergência mais próxima."

### Dados que não podem ser inventados

Nunca invente WhatsApp, e-mail, Instagram (pergunte o @), formação, pós-graduações, abordagem, anos de experiência, número de pacientes, faixa etária atendida, duração e frequência das sessões, plataforma de vídeo, valores, convênios ou reembolso. Centralize tudo em `src/app/core/data/site-content.ts` com placeholders `TODO`. **No fim de cada tarefa, liste os TODOs pendentes.**

## 7. SEO (obrigatório)

- `<html lang="pt-BR">`, **um único `<h1>`** (no hero) com os termos principais (ex.: "Psicóloga online para pessoas neurodivergentes"), hierarquia de headings correta e HTML semântico.
- `SeoService` usando `Title` e `Meta`: title com até ~60 caracteres, meta description com 140–160, canonical, robots, theme-color.
  - Title sugerido: `Iara Dhenniffy | Psicóloga Online para Neurodivergentes`.
  - Description sugerida: "Psicoterapia online com Iara Dhenniffy, psicóloga autista (CRP 15/5286). Atendimento para autistas, pessoas com TDAH, TOC, bipolaridade e outras mentes fora do padrão."
- **Open Graph e Twitter Card** com `public/og-image.jpg` (1200×630) com foto da Iara.
- **JSON-LD** injetado no SSR:
  - `ProfessionalService` (ou `MedicalBusiness` com `medicalSpecialty: "Psychiatric"`; prefira `ProfessionalService` + `additionalType` de psicologia) com nome, imagem, `areaServed: { "@type": "Country", "name": "Brasil" }`, `availableChannel` online, `serviceType: "Psicoterapia online"`, `knowsAbout` (autismo, TDAH, TOC, transtorno bipolar, neurodiversidade) e `sameAs` (Instagram, quando informado);
  - `Person` (Iara Dhenniffy, `jobTitle: "Psicóloga"`, `identifier` CRP 15/5286, `knowsAbout`);
  - `FAQPage` e `WebSite`. **Sem endereço físico** (atendimento só online) e sem `Review`/`AggregateRating`.
- Como não há endereço, o SEO é **nacional e por tema**. Palavras-chave naturais: "psicóloga online", "psicóloga para autistas", "psicóloga autista", "terapia para TDAH online", "psicóloga TDAH adulto", "terapia para TOC online", "psicóloga transtorno bipolar", "terapia neuroafirmativa", "psicóloga neurodivergente". Sem repetição forçada.
- `public/robots.txt` e `public/sitemap.xml` com a URL de produção (TODO se ainda não houver domínio).
- Favicons completos (ico, svg, apple-touch-icon, `site.webmanifest`).
- `alt` descritivo em todas as imagens de conteúdo e `alt=""` nas decorativas.
- Core Web Vitals: LCP < 2,5s, CLS < 0,1, INP < 200ms.
- Meta: Lighthouse ≥ 95 em Performance, Acessibilidade, Boas Práticas e SEO (mobile).

## 8. Acessibilidade (nível reforçado, porque é o público do site)

- **WCAG 2.2 AA no mínimo**, buscando AAA em contraste de texto (≥ 7:1 no corpo do texto quando possível), foco bem visível, navegação completa por teclado, link "Pular para o conteúdo".
- Respeito automático ao `prefers-reduced-motion` (seção 4).
- **Linguagem simples:** parágrafos curtos, listas quando ajudarem, um assunto por bloco, termos técnicos explicados na hora.
- **Previsibilidade:** links que abrem fora do site (WhatsApp, Instagram) avisam isso no texto ou no `aria-label` ("abre o WhatsApp"). Nada de pop-up, modal automático, chat que abre sozinho ou som.
- Menu mobile acessível (`aria-expanded`, `aria-controls`, trap de foco, fechar com Esc).
- FAQ em acordeão com `<details>`/`<summary>` ou botões com `aria-expanded`.
- Formulário com `<label>` visível (não só placeholder), instruções claras, erros associados (`aria-describedby`) e explicados em linguagem simples, e checkbox de consentimento LGPD. **Dados de saúde mental são sensíveis pela LGPD:** o formulário pede só nome, forma de contato preferida e melhor horário, com um campo opcional "Quer contar algo antes?" e o aviso de não incluir detalhes sensíveis. Ofereça contato por texto (WhatsApp/e-mail) como alternativa ao telefone, já que ligar costuma ser difícil para muitas pessoas neurodivergentes.

## 9. Comandos

```bash
npm install
npm start                 # ng serve
npm run build             # build de produção (com prerender)
npm run serve:ssr:<app>   # testar o SSR localmente (nome no package.json)
npx ng lint               # se configurado
```

## 10. Definição de pronto

Uma tarefa só está pronta quando:

- [ ] `npm run build` termina sem erros nem warnings novos;
- [ ] o HTML pré-renderizado (`dist/.../index.html`) contém todo o texto, as metatags e o JSON-LD;
- [ ] não há acesso a `window`/`document`/`localStorage` no servidor;
- [ ] as animações funcionam, são destruídas corretamente e respeitam `prefers-reduced-motion`;
- [ ] nenhuma animação viola as diretrizes sensoriais da seção 4;
- [ ] o layout foi verificado em todas as larguras da seção 5;
- [ ] nada de `src/clone` foi parar no bundle;
- [ ] o texto respeita a seção 6 (CFP, linguagem neuroafirmativa, aviso de crise, CRP visível);
- [ ] a lista de TODOs de conteúdo pendente foi informada ao usuário.
