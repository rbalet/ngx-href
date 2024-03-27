import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule, Routes } from '@angular/router'
import { NgxHrefModule } from '../../../ngx-href/src/lib/href.module'
import { AppComponent } from './app.component'

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

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(routes),

    BrowserModule,
    CommonModule,

    // Init
    NgxHrefModule.forRoot({
      avoidSpam: true,
      defaultOffset: 100,
      defaultRelAttr: '',
      defaultTargetAttr: '_blank',
      retryTimeout: 300,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
