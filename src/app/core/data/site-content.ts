/**
 * Conteúdo do site, centralizado e tipado.
 *
 * Regras (AGENTS.md, seção 6):
 * - Nada de dado inventado. O que depende da Iara fica `null` com um comentário TODO
 *   e o template simplesmente não mostra aquele trecho até ser preenchido.
 * - Sem promessa de resultado, sem preço, sem depoimentos.
 * - Linguagem neuroafirmativa, literal e simples.
 */

export interface NavItem {
  readonly id: string;
  readonly label: string;
}

export interface Audience {
  readonly id: string;
  readonly title: string;
  readonly text: string;
}

export interface Pillar {
  readonly title: string;
  readonly text: string;
}

export interface Step {
  readonly title: string;
  readonly text: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface Photo {
  readonly base: string; // caminho sem largura/extensão, ex.: images/iara-hero
  readonly widths: readonly number[];
  readonly width: number; // largura intrínseca maior
  readonly height: number;
  readonly alt: string;
}

export const SITE = {
  // TODO(domínio): trocar pela URL de produção (sem barra no final). Também em public/robots.txt e public/sitemap.xml.
  url: 'https://www.exemplo.com.br',
  name: 'Iara Dhenniffy — Psicóloga',
  shortName: 'Iara Dhenniffy',
  title: 'Iara Dhenniffy | Psicóloga Online para Neurodivergentes',
  description:
    'Psicoterapia online com Iara Dhenniffy, psicóloga autista (CRP 15/5286). Atendimento para autistas, pessoas com TDAH, TOC, bipolaridade e outras mentes fora do padrão.',
  ogImage: '/og-image.jpg',
  themeColor: '#f7f3ea',
} as const;

export const PROFESSIONAL = {
  name: 'Iara Dhenniffy',
  role: 'Psicóloga',
  crp: 'CRP 15/5286',
  bio: 'Psicóloga autista · TDAH · TOC · Bipolaridade',
  tagline: 'Atendo neurodivergentes e outras mentes fora do padrão',

  // TODO(e-Psi): confirmar se o cadastro no e-Psi está ativo. Quando sim, trocar para true.
  ePsiActive: false,
  ePsiUrl: 'https://e-psi.cfp.org.br/',

  // TODO(abordagem): ex.: TCC, ACT, Análise do Comportamento, Psicanálise.
  approach: null as string | null,
  // TODO(formação): graduação, pós-graduações, cursos relevantes (uma linha por item).
  education: [] as readonly string[],
  // TODO(faixa etária): ex.: 'Adultos' ou 'Adolescentes a partir de 15 anos e adultos'.
  ageRange: null as string | null,
  // TODO(exterior): confirmar se atende brasileiros que moram fora do Brasil.
  servesAbroad: null as boolean | null,
  // TODO(avaliação/laudo): confirmar se faz avaliação ou laudo (autismo, TDAH) ou só psicoterapia.
  doesAssessment: null as boolean | null,
} as const;

export const CONTACT = {
  // TODO(WhatsApp): número só com dígitos, com DDI e DDD. Ex.: '5585999999999'.
  whatsapp: null as string | null,
  whatsappMessage: 'Oi, Iara! Vim pelo site e gostaria de saber mais sobre a terapia.',
  // TODO(e-mail): e-mail profissional.
  email: null as string | null,
  // TODO(Instagram): confirmar qual @ é o atual. Os posts mostram dois:
  // 'psicologa.iaradhenniffy' e 'iaradhenniffy.psico'. Informar sem o @.
  instagram: null as string | null,
  // TODO(formulário): URL do endpoint que recebe o formulário (ex.: Formspree, Netlify Forms, API própria).
  formEndpoint: null as string | null,
} as const;

export const SESSIONS = {
  // TODO(sessões): duração (ex.: '50 minutos').
  duration: null as string | null,
  // TODO(sessões): frequência (ex.: 'Semanal, ou como combinarmos').
  frequency: null as string | null,
  // TODO(sessões): plataforma de vídeo (ex.: Google Meet).
  platform: null as string | null,
  // TODO(sessões): emite recibo para reembolso de plano de saúde? Texto a mostrar, ou null.
  receipt: null as string | null,
} as const;

export const NAV: readonly NavItem[] = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'para-quem', label: 'Para quem' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'duvidas', label: 'Dúvidas' },
  { id: 'contato', label: 'Contato' },
];

export const PHOTOS = {
  hero: {
    base: 'images/iara-hero',
    widths: [320, 480, 630],
    width: 630,
    height: 990,
    alt: 'Iara Dhenniffy, mulher de pele morena com tranças presas no alto da cabeça, sorrindo de leve com a mão apoiada no queixo.',
  },
  about: {
    base: 'images/iara-sobre',
    widths: [320, 480, 705],
    width: 705,
    height: 880,
    alt: 'Iara Dhenniffy de camisa branca, com tranças longas, sorrindo e com o rosto apoiado na mão.',
  },
  contact: {
    base: 'images/iara-contato',
    widths: [320, 455],
    width: 455,
    height: 570,
    alt: 'Retrato de Iara Dhenniffy de cabelo solto, olhando para o lado com expressão tranquila.',
  },
} as const satisfies Record<string, Photo>;

export const HERO = {
  eyebrow: 'Psicoterapia online · Para todo o Brasil',
  h1: 'Psicóloga online para pessoas neurodivergentes',
  display: 'Um espaço onde a sua mente não precisa caber no padrão.',
  subtitle:
    'Psicoterapia online com Iara Dhenniffy, psicóloga autista. Atendo autistas, pessoas com TDAH, TOC, bipolaridade e outras mentes fora do padrão.',
  primaryCta: 'Mandar uma mensagem',
  secondaryCta: 'Ver como funciona',
} as const;

export const ABOUT = {
  eyebrow: 'Sobre mim',
  title: 'Oi, eu sou a Iara.',
  paragraphs: [
    'Sou psicóloga e sou autista. Atendo pessoas neurodivergentes e outras mentes fora do padrão, por videochamada.',
    'Ser autista faz parte de como eu entendo o mundo e de como eu escuto as pessoas. Muitas coisas que você precisa explicar em outros lugares, eu também vivo.',
    'Meu trabalho não é "consertar" ninguém. É ajudar você a entender como a sua mente funciona e a cuidar do que está difícil agora.',
  ],
  quote: 'Aqui você não precisa mascarar.',
  quoteNote:
    'Mascarar é esconder ou disfarçar seus traços para se encaixar no que os outros esperam. Isso cansa muito. Na terapia, você pode falar do seu jeito e no seu ritmo.',
} as const;

export const AUDIENCES = {
  eyebrow: 'Para quem é',
  title: 'Para quem é a terapia comigo',
  intro: 'Para pessoas que sentem que funcionam diferente, com ou sem diagnóstico.',
  items: [
    {
      id: 'autismo',
      title: 'Pessoas autistas',
      text: 'Para entender o seu funcionamento, lidar com sobrecarga sensorial e social e cuidar das relações e da autoestima. Inclusive se o diagnóstico veio na vida adulta.',
    },
    {
      id: 'tdah',
      title: 'Pessoas com TDAH',
      text: 'Para organizar a rotina de um jeito que funcione para você, entender sua relação com foco, tempo e energia e diminuir a culpa que costuma vir junto.',
    },
    {
      id: 'toc',
      title: 'Pessoas com TOC',
      text: 'Para falar sem vergonha sobre pensamentos que se repetem e rituais, e construir formas de lidar com a ansiedade no dia a dia.',
    },
    {
      id: 'bipolaridade',
      title: 'Pessoas com transtorno bipolar',
      text: 'Para conhecer seus ciclos, perceber sinais de alerta e cuidar da rotina. A terapia caminha junto com o acompanhamento psiquiátrico, quando houver.',
    },
    {
      id: 'outras',
      title: 'Outras mentes fora do padrão',
      text: 'Se você sente que funciona diferente e ainda não tem um nome para isso, também tem lugar aqui.',
    },
  ] satisfies Audience[],
  // TODO(público): confirmar se entram exemplos como altas habilidades, dupla excepcionalidade
  // e pessoas que desconfiam ser neurodivergentes. Quando confirmar, mostrar como lista.
  otherExamples: [] as readonly string[],
} as const;

export const PILLARS = {
  eyebrow: 'Como é a terapia comigo',
  title: 'Um espaço seguro, do seu jeito',
  // TODO(pilares): rascunho. A Iara precisa confirmar cada pilar antes de publicar.
  // Itens ainda NÃO incluídos, aguardando confirmação: câmera ligada ou desligada à escolha;
  // pausas durante a sessão; mensagens por texto entre sessões para combinados.
  items: [
    {
      title: 'Comunicação direta',
      text: 'Eu falo de forma clara e literal. Se algo não ficar claro, pode perguntar quantas vezes precisar.',
    },
    {
      title: 'No seu ritmo',
      text: 'Você tem tempo para pensar e responder. Silêncio também é parte da conversa.',
    },
    {
      title: 'Sem precisar mascarar',
      text: 'Você pode se mexer, desviar o olhar, usar o seu jeito de falar. Nada disso precisa ser escondido aqui.',
    },
    {
      title: 'Acolhimento sem julgamento',
      text: 'O que você sente e vive é levado a sério. Ninguém aqui vai dizer que o seu jeito está certo ou errado.',
    },
  ] satisfies Pillar[],
} as const;

export const HOW_IT_WORKS = {
  eyebrow: 'Passo a passo',
  title: 'Como funciona a terapia online',
  intro: 'Tudo acontece pela internet, sem precisar sair de casa.',
  reassurance: 'Pode mandar só um "oi". Eu explico o resto.',
  steps: [
    {
      title: 'Você manda uma mensagem',
      text: 'Pelo WhatsApp ou por e-mail. Não precisa explicar tudo de uma vez.',
    },
    {
      title: 'Eu explico e tiro suas dúvidas',
      text: 'Conto como funciona o atendimento e respondo o que você quiser saber. Você decide sem pressa.',
    },
    {
      title: 'A gente combina um horário',
      text: 'Escolhemos juntos o dia e o horário da primeira sessão.',
    },
    {
      title: 'As sessões acontecem por videochamada',
      text: 'Você participa de onde se sentir mais à vontade, com internet e um lugar reservado.',
    },
  ] satisfies Step[],
} as const;

const crisisAnswer =
  'Não. A terapia online não é um serviço de urgência. Em situação de crise, ligue 188 (CVV, 24 horas e gratuito) ou 192 (SAMU), ou procure a emergência mais próxima.';

export const FAQ = {
  eyebrow: 'Dúvidas frequentes',
  title: 'Perguntas que costumam aparecer',
  items: [
    {
      question: 'A terapia online funciona tão bem quanto a presencial?',
      answer:
        'Pesquisas mostram que, para muitas pessoas, a terapia online tem resultados parecidos com os da presencial. Ela é regulamentada pelo Conselho Federal de Psicologia (Resolução CFP nº 11/2018). Para muitas pessoas neurodivergentes, estar no próprio espaço também ajuda a diminuir a sobrecarga.',
    },
    {
      question: 'Preciso ter diagnóstico para fazer terapia com você?',
      answer:
        'Não. Você pode começar a terapia com ou sem diagnóstico. Também pode começar se ainda tem dúvidas sobre o seu funcionamento.',
    },
    {
      question: 'Você atende pessoas de todo o Brasil?',
      answer:
        'Sim. O atendimento é online, por videochamada. Você pode estar em qualquer cidade do Brasil.',
    },
    {
      question: 'Como funciona o primeiro contato?',
      answer:
        'Você manda uma mensagem. Pode ser curta. Eu respondo explicando como funciona, e tiramos as dúvidas antes de marcar qualquer coisa.',
    },
    {
      question: 'Não gosto de falar ao telefone. Tudo bem?',
      answer: 'Tudo bem. O primeiro contato pode ser todo por mensagem de texto.',
    },
    {
      question: 'O que eu preciso ter para a sessão online?',
      answer:
        'Um celular ou computador com internet, um fone de ouvido se possível, e um lugar onde você se sinta à vontade para falar.',
    },
    {
      question: 'O que eu falo na terapia fica em sigilo?',
      answer:
        'Sim. O sigilo é um dever da psicóloga, previsto no Código de Ética Profissional do Psicólogo. As exceções são poucas e estão no próprio Código, como situações de risco grave à vida.',
    },
    {
      question: 'Você atende em situação de crise?',
      answer: crisisAnswer,
    },
    // TODO(FAQ): incluir só depois de confirmar com a Iara:
    // - "Posso ficar com a câmera desligada?"
    // - "Você faz diagnóstico ou laudo?" (resposta depende de PROFESSIONAL.doesAssessment)
  ] satisfies FaqItem[],
} as const;

export const CONTACT_SECTION = {
  eyebrow: 'Contato',
  title: 'Vamos conversar?',
  text: 'Para muitas pessoas, mandar mensagem é mais fácil do que ligar. Por isso o contato aqui é por texto. Escreva quando puder.',
  formTitle: 'Prefere deixar seus dados?',
  formIntro: 'Preencha o formulário e eu entro em contato pela forma que você escolher.',
} as const;

export const CRISIS_NOTICE =
  'Este espaço não oferece atendimento de urgência. Em situação de crise, ligue 188 (CVV, 24h e gratuito) ou 192 (SAMU), ou procure a emergência mais próxima.';

export function whatsappLink(): string | null {
  if (!CONTACT.whatsapp) return null;
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;
}

export function instagramLink(): string | null {
  return CONTACT.instagram ? `https://www.instagram.com/${CONTACT.instagram}/` : null;
}

export function srcset(photo: Photo, ext: 'avif' | 'webp'): string {
  return photo.widths.map((w) => `${photo.base}-${w}.${ext} ${w}w`).join(', ');
}
