import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { NgxHrefServiceProvider } from './href.const'
import { NgxHrefServiceConfig } from './href.interface'

@Injectable({
  providedIn: 'root',
})
export class NgxHrefService {
  private renderer: Renderer2

  anchor$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)
  loadedAnchor$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null) // Trigger the scrollTo mechanism from outside

  avoidSpam?: boolean
  behavior!: ScrollBehavior
  block!: ScrollLogicalPosition
  defaultRelAttr?: string
  defaultTargetAttr!: string
  inline!: ScrollLogicalPosition
  retryTimeout?: number

  private _actualAnchor?: string

  constructor(
    @Inject(NgxHrefServiceProvider) _config: NgxHrefServiceConfig,
    _rendererFactory: RendererFactory2,
  ) {
    this.renderer = _rendererFactory.createRenderer(null, null)

    this.avoidSpam = _config.avoidSpam
    this.behavior = _config.behavior || 'auto'
    this.block = _config.block || 'start'
    this.defaultRelAttr = _config.defaultRelAttr
    this.defaultTargetAttr = _config.defaultTargetAttr || '_self'
    this.inline = _config.inline || 'nearest'
    this.retryTimeout = _config.retryTimeout || 0

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

    const anchorRef: HTMLElement = this.renderer.selectRootElement(`#${anchor}`, true)

    if (anchorRef) {
      anchorRef.scrollIntoView({ behavior: this.behavior, block: this.block, inline: this.inline })

      setTimeout(() => {
        anchorRef.scrollIntoView({ behavior: this.behavior })

        this._actualAnchor = undefined
      }, this.retryTimeout)
    } else {
      setTimeout(() => {
        if (anchor !== this._actualAnchor) return

        counter++
        this.scrollTo(anchor, counter)
      }, 200)
    }
  }
}
