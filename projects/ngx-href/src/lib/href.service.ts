import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { NgxHrefServiceProvider } from './href.const'

@Injectable({
  providedIn: 'root',
})
export class NgxHrefService {
  readonly #rendererFactory = inject(RendererFactory2)
  readonly #config = inject(NgxHrefServiceProvider, { optional: true })

  private _renderer = this.#rendererFactory.createRenderer(null, null)

  anchor$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)
  loadedAnchor$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null) // Trigger the scrollTo mechanism from outside

  private _behavior = this.#config?.behavior || 'auto'
  private _block = this.#config?.block || 'start'
  private _inline = this.#config?.inline || 'nearest'
  private _retryTimeout = this.#config?.retryTimeout || 0

  private _actualAnchor?: string

  constructor() {
    this.loadedAnchor$.subscribe((anchor) => {
      if (anchor === this._actualAnchor) {
        this.scrollTo(anchor, 9) // 9: triggered only once
      }
    })
  }

  setAnchor(anchor: string) {
    this._actualAnchor = anchor
    this.anchor$.next(anchor)
  }

  scrollTo(anchor?: string, counter = 0) {
    if (
      !anchor ||
      counter >= 10 // Counter over, this element doesn't exist or the page is too slow
    ) {
      this._actualAnchor = undefined
      return
    }
    if (anchor === this._actualAnchor && counter === 0) return // Multiple click on the same url

    if (counter === 0) {
      this.setAnchor(anchor)
    }

    const anchorRef: HTMLElement = this._renderer.selectRootElement(`#${anchor}`, true)

    if (anchorRef) {
      anchorRef.scrollIntoView({
        behavior: this._behavior,
        block: this._block,
        inline: this._inline,
      })

      setTimeout(() => {
        anchorRef.scrollIntoView({ behavior: this._behavior })

        this._actualAnchor = undefined
      }, this._retryTimeout)
    } else {
      setTimeout(() => {
        if (anchor !== this._actualAnchor) return

        counter++
        this.scrollTo(anchor, counter)
      }, 200)
    }
  }
}
