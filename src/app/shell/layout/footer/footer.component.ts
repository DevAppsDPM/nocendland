import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatIcon} from "@angular/material/icon"

import {FooterService} from "@shell/state/footer.service"

@Component({
    selector: 'app-footer',
  imports: [
    MatIcon
],
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(protected footerService: FooterService) {
  }

  protected getTextWidth(text: string): string {
    return (text.length * 10) + 'px'
  }
}
