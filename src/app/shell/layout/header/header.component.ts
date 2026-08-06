import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {SideNavService} from "@shell/state/side-nav.service";
import {HeaderService} from "@shell/state/header.service"
import {MatDivider} from "@angular/material/divider"
import {NavigationService} from "@shell/navigation/navigation.service"

@Component({
    selector: 'app-header',
    imports: [
        MatIcon,
        MatIconButton,
        MatToolbar,
        MatDivider
    ],
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    protected sideNavService: SideNavService,
    protected headerService: HeaderService,
    protected navigation: NavigationService,
  ) {
  }
}
