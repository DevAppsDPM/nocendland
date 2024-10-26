import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {SideNavService} from "@shared/services/layout/side-nav.service";
import {HeaderService} from "@shared/services/layout/header.service"
import {MatDivider} from "@angular/material/divider"

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatToolbar,
    MatDivider
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(protected sideNavService: SideNavService, protected headerService: HeaderService) {
  }
}
