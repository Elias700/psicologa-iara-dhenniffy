import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

/**
 * Loader das imagens locais: `images/iara-hero-630` + largura 480 → `images/iara-hero-480.webp`.
 * As larguras disponíveis estão em PHOTOS (site-content.ts) e foram geradas em public/images.
 */
function localImageLoader(config: ImageLoaderConfig): string {
  const base = config.src.replace(/-\d+$/, '');
  return config.width ? `${base}-${config.width}.webp` : `${config.src}.webp`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // Hidratação incremental: as seções abaixo do hero só hidratam perto da tela (menos JS no carregamento).
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    { provide: IMAGE_LOADER, useValue: localImageLoader },
  ],
};
