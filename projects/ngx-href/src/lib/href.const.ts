import { InjectionToken } from '@angular/core'
import { NgxHrefServiceConfig } from './href.interface'

export const NgxHrefServiceProvider = new InjectionToken<NgxHrefServiceConfig>(
  'NgxHrefServiceConfig',
)
