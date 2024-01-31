import { ModuleWithProviders, NgModule } from '@angular/core'
import { NgxHrefServiceProvider } from './href.const'
import { NgxHrefServiceConfig } from './href.interface'
import { NgxHrefService } from './href.service'

@NgModule({})
export class NgxHrefModule {
  static forRoot(config: NgxHrefServiceConfig): ModuleWithProviders<NgxHrefModule> {
    return {
      ngModule: NgxHrefModule,
      providers: [
        NgxHrefService,
        {
          provide: NgxHrefServiceProvider,
          useValue: config,
        },
      ],
    }
  }
}
