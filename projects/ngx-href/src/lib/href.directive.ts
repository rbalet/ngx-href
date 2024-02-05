import { Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { NgxHrefService } from './href.service'

@Directive({
  standalone: true,
  selector: 'a[href], button[href]',
})
export class NgxHrefDirective implements OnDestroy {
  private _tagName: 'BUTTON' | 'A' = this._elementRef.nativeElement.tagName

  @HostBinding('attr.rel') relAttr?: string
  @HostBinding('attr.target') targetAttr?: string
  @HostBinding('attr.href') hrefAttr: string | null = ''

  @HostListener('click', ['$event']) onClick(event: PointerEvent) {
    if (!this.hrefAttr || !this._routeOnClick) return

    event.preventDefault()

    const fragments = this.hrefAttr.split('#')

    if (fragments.length >= 2) {
      const urlFragments = this._router.url.split('#')

      if (fragments[0] === urlFragments[0]) this._ngxHrefService.scrollTo(fragments[1])
      else {
        this._router.navigate([fragments[0]], { fragment: decodeURI(fragments[1]) }).then(() => {
          this._ngxHrefService.scrollTo(fragments[1])
        })
      }
    } else {
      this._router.navigate([fragments[0]])
    }
  }

  @Input() set rel(value: string) {
    this.relAttr = value
  }
  @Input() set target(value: string) {
    this.targetAttr = value
  }
  @Input() set href(value: string) {
    if (!value) {
      this.hrefAttr = null
      return
    }

    try {
      this.hrefAttr = value?.replace(/ /g, '') || ''
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

  private _hrefAttr?: string // spam protection
  private _mouseenterListener: any = null // EventListener | null
  private _clickListener: any = null // EventListener | null
  private _routeOnClick = false

  constructor(
    private _elementRef: ElementRef,
    private _router: Router,
    private _ngxHrefService: NgxHrefService,
  ) {}

  private _isLinkMailOrPhone(): boolean {
    if (this.hrefAttr?.startsWith('mailto') || this.hrefAttr?.startsWith('tel')) {
      if (this._ngxHrefService.avoidSpam) {
        this._hrefAttr = this.hrefAttr

        if (this.hrefAttr?.startsWith('mailto'))
          this.hrefAttr = this.hrefAttr.replace('mailto:', '').split('@').join('(at)')
        else this.hrefAttr = this.hrefAttr.replace('tel:', '')

        this._mouseenterListener = () => {
          if (this._hrefAttr) this.hrefAttr = this._hrefAttr
        }

        this._elementRef.nativeElement.addEventListener('mouseenter', this._mouseenterListener)
      }

      if (this._tagName !== 'A') this._prepareOpenLink()
      return true
    }

    return false
  }

  private _isLinkExternal(): boolean {
    return this.hrefAttr?.startsWith('http') ? true : false
  }
  private _prepareOpenLink() {
    if (!this.relAttr && this._ngxHrefService.defaultRelAttr)
      this.relAttr = this._ngxHrefService.defaultRelAttr
    if (!this.targetAttr) this.targetAttr = this._ngxHrefService.defaultTargetAttr

    this._clickListener = (event: PointerEvent) => {
      event.preventDefault()

      const hrefAttr = this._hrefAttr || this.hrefAttr
      if (hrefAttr) window.open(hrefAttr, this.targetAttr, this.relAttr)
    }

    this._elementRef.nativeElement.addEventListener('click', this._clickListener)
  }

  private _isSamePageLink(): boolean {
    return this.hrefAttr && this.hrefAttr[0] === '#' ? true : false
  }

  private _prepareScrollToLink() {
    this._clickListener = (event: PointerEvent) => {
      event.preventDefault()

      if (this.hrefAttr) this._ngxHrefService.scrollTo(this.hrefAttr.substring(1))
    }

    this._elementRef.nativeElement.addEventListener('click', this._clickListener)
  }

  ngOnDestroy(): void {
    if (this._mouseenterListener)
      this._elementRef.nativeElement.removeEventListener('mouseenter', this._mouseenterListener)
  }
}
