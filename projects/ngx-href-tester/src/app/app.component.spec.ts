import { CommonModule } from '@angular/common'
import { TestBed, waitForAsync } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxHrefModule } from '../../../ngx-href/src/lib/href.module'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        AppComponent,

        // Vendors
        NgxHrefModule.forRoot({
          defaultTargetAttr: '_blank',
        }),
        ,
      ],
    }).compileComponents()
  }))

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  })
})
