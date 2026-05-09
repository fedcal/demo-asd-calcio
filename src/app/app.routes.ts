import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'ASD Polisportiva Aurora — Calcio Giovanile Castegnato BS dal 1965'
  },
  {
    path: 'squadre',
    loadComponent: () => import('./pages/squadre/squadre.component').then((m) => m.SquadreComponent),
    title: 'Le Squadre — ASD Aurora Castegnato'
  },
  {
    path: 'chi-siamo',
    loadComponent: () => import('./pages/chi-siamo/chi-siamo.component').then((m) => m.ChiSiamoComponent),
    title: 'Chi siamo — ASD Aurora Castegnato'
  },
  {
    path: 'calendario',
    loadComponent: () => import('./pages/calendario/calendario.component').then((m) => m.CalendarioComponent),
    title: 'Calendario partite ed eventi — ASD Aurora Castegnato'
  },
  {
    path: 'iscrivi',
    loadComponent: () => import('./pages/iscrivi/iscrivi.component').then((m) => m.IscriviComponent),
    title: 'Iscriviti — ASD Aurora Castegnato'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
