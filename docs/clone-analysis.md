# Análise do clone — Fase 0

> Documento de referência interna. O clone em `src/clone` serve **só** para estudar movimento e interação. Nenhum texto, imagem, fonte, logo ou layout de marca do site original entra no projeto.

## 1. O que é o clone

| Item | Valor |
| --- | --- |
| Origem | Site imobiliário feito em Webflow, espelhado pelo vibecloner em 19/11/2026 |
| Código de animação | `mirror/assets.slater.app/slater/20164/60900.qo531e0.js` (≈ 59 KB minificado, ~90 funções `init*`/`animate*`) |
| Estilos de animação | CSS inline em `index.html` (marquee, tips, pins) + CSS do Webflow |
| Breakpoint principal do JS | `992px` (desktop ≥ 992, mobile < 992) |
| Fontes | Licenciadas (Typekit + Maison Neue Ext) → **não reutilizar** |

### Bibliotecas e versões

| Biblioteca | Versão | Uso no clone | Decisão |
| --- | --- | --- | --- |
| GSAP (core) | 3.15 | Todas as timelines | ✅ usar via npm (`gsap`, versão atual). Desde a 3.13 a GSAP é gratuita, incluindo os plugins |
| ScrollTrigger | 3.15 | Gatilhos, scrub, pin, horizontal | ✅ usar |
| SplitText | 3.15 | Divisão em linhas/palavras/letras com máscara | ✅ usar (só linhas e palavras) |
| CustomEase | 3.15 | Easings da marca | 🔧 desnecessário: os easings viram `cubic-bezier` em tokens/strings |
| Lenis | 1.3.21 | Smooth scroll global e local | ✅ usar via npm (`lenis`, MIT), só no desktop e só com movimento ativado |
| Lottie | 5.12.2 | Logo animada da agência no rodapé | ❌ descartar |
| Barba.js | core | Transição entre páginas | ❌ descartar (site de uma página só) |
| jQuery | 3.5.1 | Runtime do Webflow | ❌ descartar |
| Swiper | (referenciado) | Carrosséis | ❌ descartar (sem carrossel no novo site) |

### Constantes globais do clone

```
durS = 0.4s   durM = 0.8s   durL = 1.2s   stagger = 0.1s   delayReveal = 0.3s
Out    = cubic-bezier(0.25, 1, 0.5, 1)     ← suave, será o easing padrão
InOut  = cubic-bezier(0.75, 0, 0.25, 1)    ← forte demais, suavizar para (0.65, 0, 0.35, 1)
In     = cubic-bezier(0.5, 0, 0.75, 0)
Ease   = cubic-bezier(0.25, 0.1, 0.25, 1)
diveIn = cubic-bezier(0.6, 0, 0, 1)         ← só no loader, descartado
horScroll = cubic-bezier(0.25, 0, 0.75, 1)
Lenis: duration 1.2, easing expo-out (1.001 - 2^(-10t)), touchMultiplier 2, lagSmoothing(0)
```

**Novos tokens propostos** (mais calmos): `--dur-fast: 200ms`, `--dur-base: 800ms`, `--dur-slow: 1000ms`, `--stagger: 80ms`, `--ease-out: cubic-bezier(0.25, 1, 0.5, 1)`, `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`, deslocamento máximo de `24px` (teto do AGENTS.md: 40px).

### Técnicas que valem como boas práticas

- O estado "escondido" é aplicado por JS (`gsap.set(..., 'initial')`) e o elemento recebe `visibility: visible` só depois disso → equivale ao `.js-anim` do AGENTS.md. **Adotar.**
- Lenis integrado ao `gsap.ticker` e `lenis.on('scroll', ScrollTrigger.update)`. **Adotar.**
- `gsap.matchMedia()` para separar desktop e mobile. **Adotar** (e acrescentar a condição de movimento reduzido).
- `ScrollTrigger.refresh()` quando imagens carregam. **Adotar.**
- O clone **não** respeita `prefers-reduced-motion` e não tem limpeza por componente. Isso será feito do zero.

## 2. Inventário de animações e classificação

Legenda: ✅ usar como está · 🔧 usar suavizada · ❌ descartar

| # | Animação (função no clone) | Gatilho | Duração / easing / stagger | Mobile no clone | Classe | Decisão e motivo |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Smooth scroll global (`initLenis`) | Roda do mouse | 1.2s, expo-out | Toque nativo | 🔧 | `duration 1.0`, só desktop, desligado com movimento reduzido. Âncoras via `lenis.scrollTo` com offset do header |
| 2 | Preloader intro (`animatePreloaederIntro`): arco que se abre, barra de progresso de 4s, scroll travado | Carregamento | ≈ 6s no total, ease customizado | Igual | ❌ | Passa muito de 1s e trava a rolagem. Viola a seção 4 |
| 3 | Preloader curto (`animatePreloaederShort`) | 2ª visita na sessão | ≈ 2.5s | Igual | ❌ | Passa de 1s e trava a rolagem |
| 4 | Entrada da imagem do hero (escala 0.75 → 1 após o loader) | Fim do loader | 1.5s InOut | escala 1.15 → 1 | 🔧 | Vira fade + escala 1.03 → 1, 0.9s `ease-out`, uma vez. Sem loader antes |
| 5 | Texto "A" letra a letra (`animateTextA`): `rotateX 90°`, `x 10rem` | Entrar na tela | 1.2s Out, stagger 0.1 | Igual | ❌ | Letras girando e vindo de 160px de lado. Efeito de "letra piscando" que o prompt proíbe |
| 6 | Título "H" letra a letra (`animateTextH`): `rotateY 90°`, `yPercent 50` | Entrar na tela | 1.2s Out, stagger 0.05 | Igual | 🔧 | Sem rotação e sem divisão por letra: os títulos usam o mesmo reveal por **linha** do item 7 |
| 7 | Parágrafo por linha com máscara (`animateTextP`): `yPercent 110 → 0` | `top bottom`, `once` | 1.2s Out, stagger 0.1, delay 0.3 | Igual | 🔧 | É o padrão principal. 0.9s, stagger 0.08, delay 0, gatilho `top 85%`. Usado em títulos e frases curtas (não em parágrafos longos, para não atrasar a leitura) |
| 8 | Bloco/container (`animateCtn`): `opacity 0`, `y 3.3rem` (desktop) / `11.5rem` (mobile) | `top bottom`, `once` | 1.2s Out, stagger 0.1 | 184px de deslocamento | 🔧 | `y 24px` (desktop e mobile), 0.8s, stagger 0.08 |
| 9 | Linha divisória (`animateLine`): `clip-path inset` de cima para baixo | `top bottom`, `once` | 1.2s Out | Igual | ✅ | Só a duração ajustada para 0.9s. Usado nos divisores entre blocos |
| 10 | Imagem em "slide" (`animateSlide`): máscara diagonal (polygon) + imagem interna `scale 1.5`, `xPercent 25` | `top bottom`, `once` | 1.2s InOut | Igual | 🔧 | Máscara vertical simples `inset(100% 0 0 0) → inset(0)` + imagem interna `scale 1.06 → 1`. Sem diagonal e sem deslocamento lateral. 1s `ease-out` |
| 11 | "Esconder" ao voltar a rolagem (`onLeaveBack → hide`) | Rolar para cima | 0.4s In | Igual | ❌ | Conteúdo que some quando a pessoa volta é imprevisível. Tudo revela **uma vez** e fica |
| 12 | Parallax de imagem (`data-parallax="img"`): `yPercent -15 → 15` | Scrub 0.5 | linear | Pode desligar | 🔧 | `yPercent -5 → 5`, scrub 0.8, **só desktop**. A imagem tem uma folga de 12% para não aparecer borda |
| 13 | Parallax de entrada/saída (`img-in`, `img-out`: 0 ↔ 20%) | Scrub | linear | Pode desligar | ❌ | Redundante com o 12. Um parallax por seção basta |
| 14 | Parallax de container (`ctn-up`/`ctn-down`: ±10%) | Scrub 0.5 | linear | Pode desligar | 🔧 | ±3%, só desktop, só em elementos decorativos (nunca em blocos de texto) |
| 15 | Troca de tema do header pela cor da seção (`initThemeChange`) | Seção passa sob o header | Troca de classe | Igual | ✅ | Adaptado: o header muda entre tema claro e verde conforme a seção. Transição de cor de 0.6s entre tons próximos |
| 16 | Troca gradual de cor de fundo | — (no clone é só por classe) | — | — | 🔧 | Derivada do item 15: fundo da página interpola entre creme e sálvia claro, 0.6s, só tons próximos |
| 17 | Snap de seções (`initSnapSections`): rola sozinho até a seção mais visível | Parar de rolar por 40ms | 1.2s | Desligado | ❌ | Rolagem "sequestrada" e imprevisível |
| 18 | Vídeos tocando/pausando no scroll (`initPlayPauseVideoScroll`) | Entrar/sair da tela | — | Igual | ❌ | Não há vídeo, e seria movimento automático |
| 19 | Fluxo do hero (`initTranistionFlow`): hero fixo + imagem de fundo `scale 1 → 2` no scrub | Scroll | scrub | Sem a subida | ❌ | Zoom 2× é gatilho vestibular. Fica só o item 4 |
| 20 | Espaçamento de palavras abrindo (`wordSpacing 0 → 10rem`) | Scrub | linear | Igual | ❌ | Separa as palavras e prejudica a leitura |
| 21 | Bloco central surgindo (`scale 0.75 → 1`, `opacity`) + reveal de texto | Scrub 0.5 | linear | Igual | 🔧 | `scale 0.97 → 1` + opacity, para o fechamento do Contato |
| 22 | Scroll horizontal (`.loc-scroll-area`): trilho com `x` no scrub, `horScroll`, scrub 0.25, só ≥ 992px | Pin vertical | scrub 0.25 | Vira coluna | 🔧 *(opcional)* | Se aprovado: "Para quem é" no desktop ≥ 1024px, scrub 1, com barra de progresso visível. **Recomendo não usar** (ver pergunta 9) |
| 23 | Linhas de título derivando para os lados (`xPercent` em direções opostas) | Scrub | linear | — | ❌ | Texto se movendo em direções diferentes é desconfortável |
| 24 | Revelação de imagem da esquerda para a direita (`inset(0 100% 0 0)`) | `once` | 2.4s Out | Igual | 🔧 | 1s. Variante "horizontal" do item 10 |
| 25 | Fundo com `scale 1.15 → 1` no scrub | Scrub 0.25 | Ease | Igual | ❌ | Coberto pelo item 10 |
| 26 | Área "amenities": `scale 1 → 2` + fade-out | Scrub | In | Igual | ❌ | Zoom 2× |
| 27 | Janela em arco: `clip-path` em arco abrindo + `scale 1.84` | Scrub, só desktop | InOut | Desligado | ❌ | Zoom grande e sequência complexa. Só o **formato de arco** (estático) pode moldurar a foto, se gostar |
| 28 | Rodapé: máscara fechando para `inset(8% 22%)` + conteúdo `scale 0.75 → 1` | Scrub 0.5 | linear | `inset(4% 32%)` | 🔧 | Máscara bem leve `inset(0) → inset(1.5% 3% round 24px)` + conteúdo `scale 0.97 → 1`, só desktop, no bloco final de Contato |
| 29 | Indicador "role para baixo" sumindo | Scrub | InOut | Igual | ✅ | Seta estática (sem quicar) que some ao rolar |
| 30 | Numeração automática (`initIndexCounter` → "1.0", "2.0") | Load | — | — | ✅ | Vira contador CSS "01–04" no passo a passo |
| 31 | Texto que se ajusta à largura (`fitText`) | Resize | — | — | ❌ | Fonte calculada em px quebra o zoom do navegador (acessibilidade) |
| 32 | Botão magnético (`initMagneticEffect`, `elastic.out`) | Mover o mouse | 1.6s elástico | Desligado | ❌ | Botão que persegue o cursor e balança |
| 33 | Hover do menu letra a letra subindo (`initNavItemHover`) | Hover | 0.8s, stagger | — | 🔧 | Sublinhado que cresce (`scaleX`) + troca de cor, 0.3s. Sem dividir letras |
| 34 | Hover de link com letras girando + sublinhado (`initLinkHover`) | Hover | 0.8s | — | 🔧 | Só o sublinhado `scaleX` (0.4s). Letras ❌ |
| 35 | Hover de botão com arco SVG crescendo (`initBtnCircleHover`, `strokeDasharray`) | Hover | 0.8s InOut | — | 🔧 | Desenho de traço de 0.5s no botão circular "Agendar conversa". Fica parado com movimento reduzido |
| 36 | Pulso infinito de pin no mapa (`initPins`, `repeat: -1`) | Load | 1.2s em loop | Igual | ❌ | Pulsação infinita |
| 37 | Logo girando sem parar, acelerando com o scroll (`initLogo`) | Contínuo | infinito | Igual | ❌ | Rotação contínua (proibido) |
| 38 | Barra de rolagem customizada com % (`initScrollBar`) | Scroll | — | Desligado | 🔧 | Barra fina de progresso de leitura no topo (`scaleX`), só desktop. Ajuda a saber "quanto falta" |
| 39 | Cards com partes animando no hover (`initCardParts`) | Hover | 1.2s | — | 🔧 | Só troca de tom de fundo e linha revelando, 0.3s. Texto não reanima |
| 40 | Acordeão (`initAccordion`): `height auto` 1.2s + ícone `rotate -45°` + reveal de texto | Clique | 1.2s Out | Igual | 🔧 | FAQ com `<details>`: altura 0.35s, ícone + → − (rotação única de 45°, não contínua). Sem reveal de texto dentro |
| 41 | Menu em modal (`initModalMenu`): fade do overlay, hambúrguer vira X, links entram, scroll travado | Clique | 0.8–1.2s | Igual | 🔧 | Menu mobile: fade 0.25s, links com `y 12px` e stagger 0.05, trap de foco, Esc fecha |
| 42 | Modais de CTA e dicas flutuantes (`initModalCta`, `initFloatingTips`) | Clique/hover | — | — | ❌ | Nada de pop-up (seção 8) |
| 43 | Marquee CSS infinito (32s linear) | Automático | infinito | Igual | ❌ *(opcional)* | Movimento sem a pessoa rolar. Só entraria pausável e desligado por padrão (ver pergunta 9) |
| 44 | Zoom de imagem no hover, lightbox, tabs, slider, carrossel | Clique/hover | — | — | ❌ | Não há galeria no novo site |
| 45 | Transições de página (Barba) | Navegação | 0.8s | — | ❌ | Uma página só. A Política de Privacidade abre sem transição |
| 46 | Banner de cookies (`initCookies`) | Load | — | — | ❌ | Sem rastreamento, sem banner (seção 5) |
| 47 | Lottie da agência | Load | — | — | ❌ | Identidade do site original |

### Comportamento com movimento reduzido (`prefers-reduced-motion`)

Ficam desligados: 1, 12, 14, 16 (a cor troca sem transição), 21, 22, 28, 35, 38 e qualquer scrub. Os itens 4, 7, 8, 9, 10 e 24 viram **fade de 150ms**, sem deslocamento. O conteúdo aparece já visível, e a rolagem é a nativa.

### Mobile (< 768px)

Sem parallax, sem pin, sem scroll horizontal, sem máscaras no scrub. Ficam só os reveals curtos (7, 8, 9, 10) com `y 16px`.

## 3. Mapeamento: animação aprovada → seção → diretiva

| Seção do novo site | Animação (nº acima) | Diretiva Angular |
| --- | --- | --- |
| Global | 1 smooth scroll, âncoras com offset | `ScrollAnimationService` |
| Global | Barra de progresso de leitura (38) | `appScrollProgress` |
| Global | Troca de fundo entre seções (15, 16) | `appBgShift` |
| Header | Tema claro/verde por seção (15), hover de link (33) | `appBgShift` + CSS |
| Header (mobile) | Menu (41) | componente `header` (sem diretiva) |
| Hero | Entrada da foto (4), título por linha (7), subtítulo e CTA (8), seta "role" (29) | `appImageMask`, `appSplitText`, `appReveal` |
| Sobre a Iara | Parallax leve na foto (12), máscara de imagem (10), texto palavra a palavra no scrub* | `appParallax`, `appImageMask`, `appScrubWords` |
| Para quem é | Cards com stagger (8), divisores (9), hover de card (39) | `appReveal` (modo `stagger`) |
| Como é a terapia comigo | Títulos por linha (7), pilares com stagger (8) | `appSplitText`, `appReveal` |
| Como funciona a terapia online | Passos 01–04 (30) com pin no desktop e linha de conexão desenhada no scrub | `appPinSteps`, `appDrawSvg` |
| Dúvidas (FAQ) | Acordeão (40), título por linha (7) | CSS + `appSplitText` |
| Contato | Bloco de fechamento (21) + máscara leve (28), CTA com arco (35) | `appScaleIn`, `appDrawSvg` |
| Footer | Divisores (9) | `appReveal` (variante `line`) |

\* *O texto palavra a palavra no scrub foi pedido no prompt. O clone não tem essa animação exata. Ela será derivada do item 7, com cada palavra indo de `opacity 0.35 → 1`, sem deslocamento, e no mobile vira texto estático.*

Todas as diretivas leem `MotionPreferenceService.motionEnabled()` e, ao mudar, fazem `ctx.revert()` (desligar) ou recriam o `gsap.context` (religar).

## 4. Arquivos de `public/` e uso planejado

| Arquivo | O que é | Uso proposto |
| --- | --- | --- |
| `Logo de Psicóloga Iara Dhenniffy em Verde e Dourado.png` (1,1 MB) | Logo: símbolo Ψ + perfil feminino dourado + folhas, "PSICÓLOGA / Iara Dhenniffy / CRP • PSICÓLOGA CLÍNICA". **Arquivo muito escuro, borrado, com brilho e fundo preto** | Inutilizável como está. Até chegar uma versão limpa, uso o nome em texto (wordmark). Cores extraídas para a paleta |
| `snapinsta-1795255882576.jpg` (1440×1800) | Iara de blusa vermelha, fundo oliva, olhando para a câmera. Tem o texto "TDAH & amor" e o @ por cima | **Hero**, recortando a metade direita (sem o texto). Também serve de base para o `og-image` |
| `snapinsta-1795255731432.jpg` (1440×1800) | Iara de camisa branca, fundo vermelho, sorrindo. Tem texto e marca d'água "pia" por cima | **Sobre**, recortando a parte esquerda e inferior (sem os textos) |
| `snapinsta-1795255802876.jpg` (1440×1800) | Iara de blazer preto, fundo oliva, olhando para o lado. Texto grande por cima | Reserva (Contato ou Como é a terapia). O recorte sem texto fica estreito |
| `snapinsta-1795255825314.jpg` (1440×1920) | Iara numa poltrona segurando uma caneca escrita "LÁGRIMAS DOS MEUS PACIENTES". Marca d'água de IA (✦ do Gemini) no canto | ❌ **Não usar.** A piada da caneca contradiz o tom acolhedor e pode soar como desrespeito ao sofrimento dos pacientes (ética do CFP). A imagem parece gerada ou editada por IA |
| `favicon.ico` | Favicon padrão do Angular | Substituir na Fase 3 |

**Problema geral:** todas as fotos são posts do Instagram com texto aplicado, em resolução 1440 px. Os recortes vão ficar com cerca de 700 a 880 px de largura. Funciona no celular, mas fica no limite em telas grandes. O ideal são fotos originais sem texto (ver pergunta 7).

**Observação:** os posts mostram **dois @ diferentes**: `@psicologa.iaradhenniffy` e `@iaradhenniffy.psico`.

## 5. Paleta proposta (extraída da logo e do Instagram)

A logo é verde-escuro + dourado. O Instagram usa oliva, vermelho e creme. A proposta baixa a saturação e reserva o vermelho para detalhes pequenos.

| Token | Cor | Uso | Contraste |
| --- | --- | --- | --- |
| `--color-bg` | `#F7F3EA` creme quente | Fundo principal | — |
| `--color-surface` | `#EEEADB` areia clara | Cards, faixas alternadas | — |
| `--color-sage` | `#E3E4D3` sálvia clara (do oliva) | Seções alternadas (troca gradual de fundo) | — |
| `--color-text` | `#22302A` grafite esverdeado | Texto do corpo | 12,4:1 no creme · 10,7:1 na sálvia (AAA) |
| `--color-text-muted` | `#44504A` | Texto secundário | 7,6:1 no creme (AAA) · 6,5:1 na sálvia (AA) |
| `--color-primary` | `#2F4A3A` verde da logo | Títulos, botões, links | 8,8:1 (AAA) |
| `--color-deep` | `#1E3328` verde profundo | Seção de contato e rodapé (fundo) | Creme sobre ele: 12,2:1 |
| `--color-gold` | `#D9B26A` dourado da logo | Detalhes **sobre o verde profundo** (linhas, números 01–04, foco) | 6,8:1 no verde (AA para texto grande) |
| `--color-gold-ink` | `#8A5A1F` dourado escuro | Detalhes dourados sobre fundo claro | 5,3:1 (só texto grande e ícones) |
| `--color-accent` | `#9A4A33` terracota (do vermelho do Instagram, menos saturado) | Pequenos destaques, nunca em grandes áreas | 5,6:1 (só texto grande) |

Sem branco puro, sem preto puro, sem neon. O foco visível usa um contorno de 3px em `--color-primary` com afastamento de 2px (dourado sobre fundos escuros).

**Tipografia proposta:** **Atkinson Hyperlegible Next** no corpo (feita para baixa visão, letras bem distintas) e **Fraunces** nos títulos (serifada suave, combina com a serifa da logo e dos posts). As duas têm licença OFL e serão auto-hospedadas em woff2 com `font-display: swap`. Corpo de 18px, altura de linha 1,65, linhas de até 68 caracteres.

**Simbologia:** sem quebra-cabeça. O símbolo Ψ + perfil já é a identidade da Iara, então não proponho o infinito, a não ser que ela queira.

## 6. Como ficou na implementação (Fases 1–4)

Mudanças em relação ao plano acima, e o motivo de cada uma:

| Item | Plano | Implementado | Motivo |
| --- | --- | --- | --- |
| Hero (4, 7, 8) | Diretivas GSAP | **CSS puro** (`.hero-enter`, `.hero-mask` em `styles.scss`) | Não esperar o JS: o LCP fica em ~1s. A máscara começa em `inset(10%)`, então a foto já aparece na primeira pintura |
| Pin do passo a passo | `ScrollTrigger.pin` | **CSS `position: sticky`** + linha com scrub (`appStepsProgress`) | Sem pin-spacer, sem salto de layout, funciona com teclado e leitor de tela |
| Fundo entre seções (15, 16) | Diretiva GSAP | `appSectionTheme` + `SectionThemeService` (sem GSAP) | Funciona também com movimento reduzido (troca sem transição) |
| Seta "role para baixo" (29) | Usar | Não incluída | Os dois botões do hero já levam adiante. Menos elementos na tela |
| Montagem das animações | De uma vez | **Fila em fatias de ~12ms** (`ScrollAnimationService.enqueue`) | Uma tarefa única travava o celular (TBT de 770ms) |
| Hidratação | Página inteira | **Incremental** (`@defer (hydrate on viewport)`) nas seções abaixo do hero e no rodapé | Menos JS no carregamento. O HTML continua completo no prerender |

**Garantias contra conteúdo preso:** cada elemento `[data-anim]` fica escondido só até a diretiva dele iniciar (`.anim-ready`). Se o app não iniciar em 4s, `.anim-failsafe` mostra tudo. Um `IntersectionObserver` mostra qualquer elemento que fique 1,2s na tela sem iniciar. Sem JS, nada fica escondido.

**Rolagem até âncoras:** o `ScrollTrigger.refresh()` é adiado enquanto uma rolagem programada estiver em andamento, porque ele cancelava a rolagem suave nativa no celular. No fim, a posição é corrigida se o layout tiver mudado.

## 7. Segunda versão visual (substitui a direção de arte das seções 3, 5 e 6)

A primeira versão aproveitava só o movimento do modelo. Esta segue também a linguagem de cena dele, com identidade própria (cores, fontes, textos e imagens da Iara).

| Recurso do modelo | Versão da Iara | Onde |
| --- | --- | --- |
| Hero em tela cheia com título gigante | Figura recortada sangrando na tela, sálvia, título em Instrument Serif | `hero` |
| Cúpula que sobe com texto em curva | Cúpula verde sobre o hero fixo (CSS sticky, sem zoom) | `manifesto` |
| Título sobreposto à imagem, metadados ao lado | "Oi, eu sou [retrato em arco] a Iara." e ficha profissional | `about` |
| Cena horizontal | Colunata de arcos (`appHorizontalScroll`), só ≥ 1024 px, com altura definida em CSS | `who-i-help` |
| Citação sobre imagem em tela cheia | Frase publicada pela própria Iara | `quote` |
| Mapa com linha sinuosa | Passo a passo sobre linha que se desenha (`appDrawPath`) | `how-it-works` |
| Selo circular giratório | Selo **estático** | `seal` |
| Barra de rolagem customizada | Trilho lateral com percentual (`appScrollProgress`), só ≥ 1280 px | `header` |
| Flores nos cantos | Ramos em SVG derivados das folhas da logo, estáticos | `sprig` |
| Rodapé com marca gigante | Nome na largura da tela | `footer` |

**Continua descartado:** loader, zoom de 2×, letras girando, rotação contínua, snap de seção, botão magnético, vídeo automático.

**Movimento reduzido e celular:** sem cena fixa, sem rolagem horizontal, sem parallax; a colunata vira uma grade e a linha já aparece completa.

**Paleta atual:** creme `#f6f1e4`, sálvia `#cdd2b8`, areia `#dcc797`, verde `#1d3628`, verde profundo `#14271c`, vermelho `#8a3324`, dourado `#d9b26a`, texto `#16241c`. Texto corrido sempre ≥ 7:1.

**Botão "Reduzir movimento":** removido a pedido (nov/2026). O site segue o `prefers-reduced-motion` do sistema.
