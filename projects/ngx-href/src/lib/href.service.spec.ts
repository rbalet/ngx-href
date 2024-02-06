import { TestBed } from '@angular/core/testing'
import { NgxHrefModule } from './href.module'
import { NgxHrefService } from './href.service'

describe('DarkModeService', () => {
  let service: NgxHrefService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxHrefModule.forRoot({
          defaultTargetAttr: '_blank',
        }),
      ],
    })
    service = TestBed.inject(NgxHrefService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
