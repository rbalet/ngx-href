import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: 'first',
        loadComponent: () => import('./first/first.component').then((m) => m.FirstComponent),
      },
      {
        path: 'second',
        loadComponent: () => import('./second/second.component').then((m) => m.SecondComponent),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
]
