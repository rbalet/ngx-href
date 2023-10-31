import { Directive, ElementRef, HostBinding, Input } from '@angular/core'
import { Router } from '@angular/router'
import { NgxHrefService } from './href.service'

@Directive({
  standalone: true,
  selector: 'a[href], button[href]',
})
export class NgxHrefDirective {
  tagName: 'BUTTON' | 'A' = this._elementRef.nativeElement.tagName

  @HostBinding('attr.rel') relAttr?: string
  @HostBinding('attr.target') targetAttr?: string
  @HostBinding('attr.href') hrefAttr: string | null = ''
  @Input() set rel(value: string) {
    this.relAttr = value
  }
  @Input() set href(value: string) {
    if (!value) {
      this.hrefAttr = null
      return
    }

    this.hrefAttr = value?.replace(/ /g, '') || ''

    if (this._isLinkMailOrPhone()) return

    if (this._isLinkExternal()) {
      this._prepareOpenLink()
    } else if (this._isSamePageLink()) {
      this._prepareScrollToLink()
    } else {
      this._prepareRouteToClick()
    }
  }

  constructor(
    private _elementRef: ElementRef,
    private _router: Router,
    private _ngxHrefService: NgxHrefService,
  ) {}

  private _isLinkMailOrPhone(): boolean {
    if (this.hrefAttr?.startsWith('mailto') || this.hrefAttr?.startsWith('tel')) {
      if (this.tagName === 'BUTTON') this._prepareOpenLink()
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

    this._elementRef.nativeElement.addEventListener('click', (event: PointerEvent) => {
      event.preventDefault()

      if (this.hrefAttr) window.open(this.hrefAttr, this.targetAttr, this.relAttr)
    })
  }

  private _isSamePageLink(): boolean {
    return this.hrefAttr && this.hrefAttr[0] === '#' ? true : false
  }

  private _prepareScrollToLink() {
    this._elementRef.nativeElement.addEventListener('click', (event: PointerEvent) => {
      event.preventDefault()

      if (this.hrefAttr) this._ngxHrefService.scrollTo(this.hrefAttr.substring(1))
    })
  }

  private _prepareRouteToClick() {
    this._elementRef.nativeElement.addEventListener('click', (event: PointerEvent) => {
      event.preventDefault()

      if (!this.hrefAttr) return

      const fragments = this.hrefAttr.split('#')
      const urlFragments = this._router.url.split('#')

      if (fragments.length >= 2) {
        if (fragments[0] === urlFragments[0]) this._ngxHrefService.scrollTo(fragments[1])
        else this._router.navigate([fragments[0]], { fragment: decodeURI(fragments[1]) })
      } else {
        this._router.navigate([fragments[0]])
      }
    })
  }
}
