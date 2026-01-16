import { effect, inject, Injectable, RendererFactory2, signal } from '@angular/core'
import { NgxHrefServiceProvider } from './href.const'

@Injectable({
  providedIn: 'root',
})
export class NgxHrefService {
  readonly #rendererFactory = inject(RendererFactory2)
  readonly #config = inject(NgxHrefServiceProvider, { optional: true })

  private _renderer = this.#rendererFactory.createRenderer(null, null)

  $anchor = signal<string | null>(null)
  $loadedAnchor = signal<string | null>(null) // Trigger the scrollTo mechanism from outside

  private _behavior = this.#config?.behavior || 'auto'
  private _block = this.#config?.block || 'start'
  private _inline = this.#config?.inline || 'nearest'
  private _retryTimeout = this.#config?.retryTimeout || 0

  private _actualAnchor?: string

  anchorEffect = effect(() => {
    const anchor = this.$anchor()

    if (anchor) {
      this.scrollTo(anchor)
    }
  })

  setAnchor(anchor: string) {
    this._actualAnchor = anchor
    this.$anchor.set(anchor)
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

    anchorRef.scrollIntoView({
      behavior: this._behavior,
      block: this._block,
      inline: this._inline,
    })
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
