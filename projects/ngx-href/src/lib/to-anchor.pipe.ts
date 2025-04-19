import { inject, Pipe, PipeTransform } from '@angular/core'
import { NgxHrefService } from './href.service'

@Pipe({
  name: 'toAnchor',
})
export class ToAnchorPipe implements PipeTransform {
  readonly #ngxHrefService = inject(NgxHrefService)

  private _removedChars = [
    ';',
    ':',
    '!',
    '"',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '*',
    '/',
    '%',
    '^',
    '+',
    '<',
    '=',
    '>',
    '~',
  ]

  private _replacedChars: { [key: string]: string } = {
    ' ': '-',
    ',': '-',
    "'": '-',
    à: 'a',
    â: 'a',
    ã: 'a',
    ä: 'ae',
    ç: 'c',
    é: 'e',
    è: 'e',
    ê: 'e',
    ë: 'e',
    î: 'i',
    ï: 'i',
    ñ: 'n',
    ô: 'o',
    ö: 'oe',
    ß: 'ss',
    û: 'u',
    ü: 'ue',
  }

  transform(id: string, emit = true): string {
    if (!id) return ''

    let anchor = id.toLocaleLowerCase()
    Object.entries(this._replacedChars).forEach(([specialChar, replacement]) => {
      anchor = anchor.split(specialChar).join(replacement)
    })
    this._removedChars.forEach((char) => {
      anchor = anchor.split(char).join('')
    })

    if (emit) this.#ngxHrefService.loadedAnchor$.next(anchor)

    return anchor
  }
}
