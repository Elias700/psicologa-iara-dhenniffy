import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE } from '../data/site-content';
import { buildJsonLd } from './json-ld';

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  readonly path: string; // ex.: '/' ou '/privacidade'
  readonly robots?: string;
  readonly jsonLd?: boolean;
}

const JSON_LD_ID = 'jsonld-site';

/**
 * Title, metatags, canonical, Open Graph, Twitter Card e JSON-LD.
 * Roda no servidor durante o prerender, então tudo já sai no HTML estático.
 * No navegador, atualiza os mesmos elementos (sem duplicar).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(page: PageSeo): void {
    const url = `${SITE.url}${page.path === '/' ? '/' : page.path}`;
    const image = `${SITE.url}${SITE.ogImage}`;

    this.title.setTitle(page.title);
    const tags: Record<string, string>[] = [
      { name: 'description', content: page.description },
      { name: 'robots', content: page.robots ?? 'index, follow, max-image-preview:large' },
      { name: 'theme-color', content: SITE.themeColor },
      { name: 'author', content: 'Iara Dhenniffy' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'pt_BR' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: page.title },
      { property: 'og:description', content: page.description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Logo de Iara Dhenniffy, psicóloga, ao lado de uma foto dela.' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: page.title },
      { name: 'twitter:description', content: page.description },
      { name: 'twitter:image', content: image },
    ];
    for (const tag of tags) {
      const key = tag['property'] ? `property="${tag['property']}"` : `name="${tag['name']}"`;
      this.meta.updateTag(tag, key);
    }

    this.setCanonical(url);
    this.setJsonLd(page.jsonLd ? buildJsonLd() : null);
  }

  private setCanonical(url: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: object | null): void {
    const head = this.document.head;
    const existing = head.querySelector(`#${JSON_LD_ID}`);
    if (!data) {
      existing?.remove();
      return;
    }
    const script = existing ?? this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', JSON_LD_ID);
    // "<" escapado para nunca fechar a tag <script> por engano.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    if (!existing) head.appendChild(script);
  }
}
