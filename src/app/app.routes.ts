import { Routes } from '@angular/router';

import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'privacidade',
    loadComponent: () => import('./pages/privacy/privacy.page').then((m) => m.PrivacyPage),
  },
  { path: '**', redirectTo: '' },
];
