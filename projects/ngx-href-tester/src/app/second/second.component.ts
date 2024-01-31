import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgxHrefDirective } from '../../../../ngx-href/src/lib/href.directive'

@Component({
  selector: 'app-second',
  standalone: true,
  imports: [
    CommonModule,

    // Vendors
    NgxHrefDirective,
  ],
  templateUrl: './second.component.html',
  styleUrl: './second.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondComponent {}
