import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NgxHrefDirective } from '../href.directive'
import { NgxHrefModule } from '../href.module'
import { NgxHrefService } from '../href.service'

@Component({
  template: `<button #testButton href="https://github.com">Internal link</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxHrefDirective],
})
class HrefTestComponent {
  viewContainerRef: ViewContainerRef
  @ViewChild('testButton', { static: false }) testButton!: ElementRef

  constructor(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef
  }
}

describe('HrefDirective', () => {
  let fixture: ComponentFixture<HrefTestComponent>
  let hrefService: NgxHrefService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxHrefModule.forRoot({
          defaultTargetAttr: '_blank',
        }),
      ],
      declarations: [HrefTestComponent],
    })

    hrefService = TestBed.inject(NgxHrefService)

    fixture = TestBed.createComponent(HrefTestComponent)
    fixture.detectChanges() // Initial binding
  })

  it('Component does exists', () => {
    // @ToDo Add meaningful test
    expect(fixture.componentInstance.testButton.nativeElement).toBeTruthy()
  })
})
