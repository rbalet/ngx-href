import { enableProdMode, provideZonelessChangeDetection } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { NgxHrefServiceProvider } from '../../ngx-href/src/lib/href.const'
import { AppComponent } from './app/app.component'
import { routes } from './app/app.routes'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),

    {
      provide: NgxHrefServiceProvider,
      useValue: {
        avoidSpam: true,
        defaultRelAttr: '',
        defaultTargetAttr: '_blank',
        retryTimeout: 300,
      },
    },
  ],
})
