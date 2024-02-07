import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { NgxHrefModule } from '../../../ngx-href/src/lib/href.module'
import { NgxHrefService } from '../../../ngx-href/src/public-api'
import { AppComponent } from './app.component'
import { routes } from './app.module'

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let hrefService: NgxHrefService

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),

        BrowserAnimationsModule,
        CommonModule,

        // Vendors
        NgxHrefModule.forRoot({
          defaultTargetAttr: '_blank',
        }),
        ,
      ],
      declarations: [AppComponent],
    }).compileComponents()
  }))

  hrefService = TestBed.inject(NgxHrefService)

  fixture = TestBed.createComponent(AppComponent)
  fixture.detectChanges() // Initial binding

  it('should create the app', () => {
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain('href tester is running!')
  })
})
