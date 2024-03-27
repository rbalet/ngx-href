import { Inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { NgxHrefServiceProvider } from './href.const'
import { NgxHrefServiceConfig } from './href.interface'

@Injectable({
  providedIn: 'root',
})
export class NgxHrefService {
  anchor$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)
  loadedAnchor$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null) // Trigger the scrollTo mechanism from outside

  avoidSpam?: boolean
  behavior!: ScrollBehavior
  defaultOffset!: number
  navbarOffset!: number
  defaultRelAttr?: string
  defaultTargetAttr!: string
  retryTimeout?: number

  private _actualAnchor?: string

  constructor(@Inject(NgxHrefServiceProvider) _config: NgxHrefServiceConfig) {
    this.avoidSpam = _config.avoidSpam
    this.behavior = _config.behavior || 'auto'
    this.defaultOffset = typeof _config.defaultOffset === 'number' ? _config.defaultOffset : 0
    this.navbarOffset = typeof _config.navbarOffset === 'number' ? _config.navbarOffset : 0
    this.defaultRelAttr = _config.defaultRelAttr
    this.defaultTargetAttr = _config.defaultTargetAttr || '_self'
    this.retryTimeout = _config.retryTimeout

    this.loadedAnchor$.subscribe((anchor) => {
      if (anchor === this._actualAnchor) {
        this.scrollTo(anchor, 9) // 9: triggered only once
      }
    })
  }

  scrollTo(anchor?: string, counter = 0) {
    if (
      !anchor ||
      counter >= 10 || // Counter over, this element doesn't exist or the page is too slow
      (anchor === this._actualAnchor && counter === 0) // Multiple click on the same url
    )
      return

    if (counter === 0) {
      this._actualAnchor = anchor
      this.anchor$.next(anchor)
    }

    const anchorRef = document.getElementById(anchor)

    if (anchorRef) {
      const offsetPosition =
        anchorRef.getBoundingClientRect().top +
        window.scrollY -
        (this.navbarOffset + this.defaultOffset)

      window.scrollTo({
        top: offsetPosition,
        behavior: this.behavior,
      })

      if (this.retryTimeout)
        setTimeout(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: this.behavior,
          })
        }, this.retryTimeout)

      this._actualAnchor = undefined
    } else {
      setTimeout(() => {
        if (anchor !== this._actualAnchor) return

        counter++
        this.scrollTo(anchor, counter)
      }, 200)
    }
  }
}
