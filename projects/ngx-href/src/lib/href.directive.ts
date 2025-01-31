import { Directive, ElementRef, HostListener, Input, OnDestroy, signal } from '@angular/core'
import { Router } from '@angular/router'
import { NgxHrefService } from './href.service'

@Directive({
  standalone: true,
  selector: 'a[href], button[href]',
  host: {
    '[attr.rel]': 'rel$()',
    '[attr.target]': 'target$()',
    '[attr.href]': 'href$()',
  },
})
export class NgxHrefDirective implements OnDestroy {
  private _tagName: 'BUTTON' | 'A' = this._elementRef.nativeElement.tagName

  rel$ = signal<string>('')
  target$ = signal<string>('')
  href$ = signal<string | null>('')

  @HostListener('click', ['$event']) onClick(event: PointerEvent) {
    if (!this.href$() || !this._routeOnClick) return

    event.preventDefault()

    const fragments = this.href$()?.split('#')
    if (!fragments) return

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
    this.rel$.set(value)
  }
  @Input() set target(value: string) {
    this.target$.set(value)
  }
  @Input() set href(value: string) {
    if (!value) {
      this.href$.set(null)
      return
    }

    try {
      this.href$.set(value?.replace(/ /g, '') || '')
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

  private _hrefAttr?: string | null // spam protection
  private _mouseenterListener: any = null // EventListener | null
  private _clickListener: any = null // EventListener | null
  private _routeOnClick = false

  constructor(
    private _elementRef: ElementRef,
    private _router: Router,
    private _ngxHrefService: NgxHrefService,
  ) {}

  private _isLinkMailOrPhone(): boolean {
    if (this.href$()?.startsWith('mailto') || this.href$()?.startsWith('tel')) {
      if (this._ngxHrefService.avoidSpam) {
        this._hrefAttr = this.href$()

        if (this.href$()?.startsWith('mailto')) this.href$.set('mailto:obfuscated')
        else this.href$.set('tel:obfuscated')

        this._mouseenterListener = () => {
          if (this._hrefAttr) this.href$.set(this._hrefAttr)
        }

        this._elementRef.nativeElement.addEventListener('mouseenter', this._mouseenterListener)
      }

      if (this._tagName !== 'A') this._prepareOpenLink()
      return true
    }

    return false
  }

  private _isLinkExternal(): boolean {
    return this.href$()?.startsWith('http') ? true : false
  }
  private _prepareOpenLink() {
    if (!this.rel$() && this._ngxHrefService.defaultRelAttr)
      this.rel$.set(this._ngxHrefService.defaultRelAttr)
    if (!this.target$()) this.target$.set(this._ngxHrefService.defaultTargetAttr)

    this._clickListener = (event: PointerEvent) => {
      event.preventDefault()

      const hrefAttr = this._hrefAttr || this.href$()
      if (hrefAttr) window.open(hrefAttr, this.target$(), this.rel$())
    }

    this._elementRef.nativeElement.addEventListener('click', this._clickListener)
  }

  private _isSamePageLink(): boolean {
    return this.href$() && (this.href$() as any)[0] === '#' ? true : false
  }

  private _prepareScrollToLink() {
    this._clickListener = (event: PointerEvent) => {
      event.preventDefault()

      if (this.href$()) this._ngxHrefService.scrollTo(this.href$()?.substring(1))
    }

    this._elementRef.nativeElement.addEventListener('click', this._clickListener)
  }

  ngOnDestroy(): void {
    if (this._mouseenterListener)
      this._elementRef.nativeElement.removeEventListener('mouseenter', this._mouseenterListener)
  }
}
