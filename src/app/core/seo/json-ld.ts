import { CONTACT, FAQ, PHOTOS, PROFESSIONAL, SITE, instagramLink } from '../data/site-content';

/**
 * JSON-LD: ProfessionalService + Person + FAQPage + WebSite.
 * Sem endereço físico (atendimento só online) e sem Review/AggregateRating (AGENTS.md, seção 7).
 */
export function buildJsonLd(): object {
  const url = SITE.url;
  const sameAs = [instagramLink()].filter((v): v is string => !!v);
  const knowsAbout = ['Autismo', 'TDAH', 'TOC', 'Transtorno bipolar', 'Neurodiversidade', 'Psicoterapia online'];
  const personId = `${url}/#iara`;
  const serviceId = `${url}/#servico`;

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': personId,
    name: PROFESSIONAL.name,
    jobTitle: PROFESSIONAL.role,
    description: `${PROFESSIONAL.bio}. ${PROFESSIONAL.tagline}.`,
    image: `${url}/${PHOTOS.hero.base}-${PHOTOS.hero.width}.webp`,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CRP',
      value: '15/5286',
    },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Registro profissional',
      name: PROFESSIONAL.crp,
      recognizedBy: { '@type': 'Organization', name: 'Conselho Regional de Psicologia da 15ª Região' },
    },
    knowsAbout,
    worksFor: { '@id': serviceId },
    knowsLanguage: 'pt-BR',
  };
  if (sameAs.length) person['sameAs'] = sameAs;

  const service: Record<string, unknown> = {
    '@type': 'ProfessionalService',
    '@id': serviceId,
    additionalType: 'https://en.wikipedia.org/wiki/Psychotherapy',
    name: SITE.name,
    description: SITE.description,
    url: `${url}/`,
    image: `${url}${SITE.ogImage}`,
    logo: `${url}/images/logo-iara-dhenniffy.png`,
    serviceType: 'Psicoterapia online',
    areaServed: { '@type': 'Country', name: 'Brasil' },
    availableChannel: {
      '@type': 'ServiceChannel',
      name: 'Atendimento online por videochamada',
      serviceUrl: `${url}/#contato`,
      availableLanguage: 'pt-BR',
    },
    knowsAbout,
    founder: { '@id': personId },
    employee: { '@id': personId },
  };
  if (sameAs.length) service['sameAs'] = sameAs;
  if (CONTACT.email) service['email'] = CONTACT.email;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url: `${url}/`,
        name: SITE.name,
        inLanguage: 'pt-BR',
        publisher: { '@id': serviceId },
      },
      service,
      person,
      {
        '@type': 'FAQPage',
        '@id': `${url}/#duvidas`,
        mainEntity: FAQ.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };
}
