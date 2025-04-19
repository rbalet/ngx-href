import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  signal,
} from '@angular/core'
import { Router } from '@angular/router'
import { NgxHrefServiceProvider } from './href.const'
import { NgxHrefService } from './href.service'

@Directive({
  selector: 'a[href], button[href]',
  host: {
    '[attr.rel]': '$rel()',
    '[attr.target]': '$target()',
    '[attr.href]': '$href()',
  },
})
export class NgxHrefDirective implements OnDestroy {
  readonly #elementRef = inject(ElementRef)
  readonly #router = inject(Router)
  readonly #ngxHrefService = inject(NgxHrefService)
  readonly #config = inject(NgxHrefServiceProvider, { optional: true })

  private _tagName: 'BUTTON' | 'A' = this.#elementRef.nativeElement.tagName
  private _defaultTargetAttr = this.#config?.defaultTargetAttr || '_self'

  $rel = signal<string>('')
  $target = signal<string>('')
  $href = signal<string | null>('')

  @HostListener('click', ['$event']) onClick(event: PointerEvent) {
    if (!this.$href() || !this._routeOnClick) return

    event.preventDefault()

    const fragments = this.$href()?.split('#')
    if (!fragments) return

    if (fragments.length >= 2) {
      const urlFragments = this.#router.url.split('#')

      if (fragments[0] === urlFragments[0]) this.#ngxHrefService.scrollTo(fragments[1])
      else {
        this.#router.navigate([fragments[0]], { fragment: decodeURI(fragments[1]) }).then(() => {
          this.#ngxHrefService.scrollTo(fragments[1])
        })
      }
    } else {
      this.#router.navigate([fragments[0]])
    }
  }

  @Input() set rel(value: string) {
    this.$rel.set(value)
  }
  @Input() set target(value: string) {
    this.$target.set(value)
  }
  @Input() set href(value: string) {
    if (!value) {
      this.$href.set(null)
      return
    }

    try {
      this.$href.set(value?.replace(/ /g, '') || '')
    } catch (error) {
      console.error('ngx-href: Expecting a string', '\n', error)
    }

    if (this._isLinkMailOrPhone()) return

    if (this._isLinkExternal()) {
      this._prepareOpenLink()
    } else if (this._isSamePageLink()) {
      this._prepareScrollToLink()
    } else {
      this._routeOnClick = true
    }
  }

  private _clickListener: any = null // EventListener | null
  private _hrefAttr?: string | null // spam protection
  private _mouseenterListener: any = null // EventListener | null
  private _routeOnClick = false

  private _isLinkMailOrPhone(): boolean {
    if (this.$href()?.startsWith('mailto') || this.$href()?.startsWith('tel')) {
      if (this.#config?.avoidSpam) {
        this._hrefAttr = this.$href()

        if (this.$href()?.startsWith('mailto')) this.$href.set('mailto:obfuscated')
        else this.$href.set('tel:obfuscated')

        this._mouseenterListener = () => {
          if (this._hrefAttr) this.$href.set(this._hrefAttr)
        }

        this.#elementRef.nativeElement.addEventListener('mouseenter', this._mouseenterListener)
      }

      if (this._tagName !== 'A') this._prepareOpenLink()
      return true
    }

    return false
  }

  private _isLinkExternal(): boolean {
    return this.$href()?.startsWith('http') ? true : false
  }
  private _prepareOpenLink() {
    if (!this.$rel() && this.#config?.defaultRelAttr) this.$rel.set(this.#config.defaultRelAttr)
    if (!this.$target()) this.$target.set(this._defaultTargetAttr)

    this._clickListener = (event: PointerEvent) => {
      event.preventDefault()

      const hrefAttr = this._hrefAttr || this.$href()
      if (hrefAttr) window.open(hrefAttr, this.$target(), this.$rel())
    }

    this.#elementRef.nativeElement.addEventListener('click', this._clickListener)
  }

  private _isSamePageLink(): boolean {
    return this.$href() && (this.$href() as any)[0] === '#' ? true : false
  }

  private _prepareScrollToLink() {
    this._clickListener = (event: PointerEvent) => {
      event.preventDefault()

      if (this.$href()) this.#ngxHrefService.scrollTo(this.$href()?.substring(1))
    }

    this.#elementRef.nativeElement.addEventListener('click', this._clickListener)
  }

  ngOnDestroy(): void {
    if (this._mouseenterListener)
      this.#elementRef.nativeElement.removeEventListener('mouseenter', this._mouseenterListener)
  }
}
