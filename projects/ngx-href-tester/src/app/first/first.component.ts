import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NgxHrefDirective } from '../../../../ngx-href/src/lib/href.directive'

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    // Vendors
    NgxHrefDirective,
  ],
  templateUrl: 'first.component.html',
  styleUrl: './first.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstComponent {}
