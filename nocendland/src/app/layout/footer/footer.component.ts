import { Component } from '@angular/core';
import {MatDivider} from "@angular/material/divider"
import {MatIcon} from "@angular/material/icon"
import {NgForOf, NgIf} from "@angular/common"
import {FOOTER_BUTTON, FooterService} from "@shared/services/layout/footer.service"

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatDivider,
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
