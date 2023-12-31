import { Inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { NgxHrefServiceProvider } from './href.const'
import { NgxHrefServiceConfig } from './href.interface'

@Injectable({
  providedIn: 'root',
})
export class NgxHrefService {
  anchor$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

  avoidSpam?: boolean
  behavior!: ScrollBehavior
  defaultOffset!: number
  navbarOffset!: number
  defaultRelAttr?: string
  defaultTargetAttr!: string

  private _actualAnchor = ''

  constructor(@Inject(NgxHrefServiceProvider) _config: NgxHrefServiceConfig) {
    this.avoidSpam = _config.avoidSpam
    this.behavior = _config.behavior || 'auto'
    this.defaultOffset = typeof _config.defaultOffset === 'number' ? _config.defaultOffset : 0
    this.navbarOffset = typeof _config.navbarOffset === 'number' ? _config.navbarOffset : 0
    this.defaultRelAttr = _config.defaultRelAttr
    this.defaultTargetAttr = _config.defaultTargetAttr || '_self'
  }

  scrollTo(anchor?: string, counter = 0) {
    if (!anchor) return

    const newAnchor = anchor.replace(/ /g, '')

    if (counter === 0) this.anchor$.next(newAnchor)

    if (
      counter >= 10 || // Counter over, this element doesn't exist or the page is too slow
      (newAnchor === this._actualAnchor && counter === 0) // Multiple click on the same url
    )
      return

    this._actualAnchor = newAnchor

    const anchorRef = document.getElementById(newAnchor)

    if (anchorRef) {
      const offsetPosition =
        anchorRef.getBoundingClientRect().top +
        window.scrollY -
        (this.navbarOffset + this.defaultOffset)

      window.scrollTo({
        top: offsetPosition,
        behavior: this.behavior,
      })

      this._actualAnchor = ''
    } else {
      setTimeout(() => {
        counter++
        this.scrollTo(newAnchor, counter)
      }, 200)
    }
  }
}
