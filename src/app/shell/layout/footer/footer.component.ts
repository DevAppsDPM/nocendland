import {Component, ChangeDetectionStrategy} from '@angular/core';

import {FooterService} from "@shell/state/footer.service"

@Component({
    selector: 'app-footer',
  imports: [],
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(protected footerService: FooterService) {
  }
}
