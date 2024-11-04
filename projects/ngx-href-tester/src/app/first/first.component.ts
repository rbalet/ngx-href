import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgxHrefDirective } from '../../../../ngx-href/src/lib/href.directive'

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [
    // Vendors
    NgxHrefDirective,
  ],
  templateUrl: 'first.component.html',
  styleUrl: './first.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstComponent {}
