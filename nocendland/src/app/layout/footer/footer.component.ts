import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon"
import {NgForOf, NgIf} from "@angular/common"
import {FooterService} from "@shared/services/layout/footer.service"

@Component({
    selector: 'app-footer',
  imports: [
    MatIcon,
    NgForOf,
    NgIf
  ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(protected footerService: FooterService) {
  }

  protected getTextWidth(text: string): string {
    return (text.length * 10) + 'px'
  }
}
