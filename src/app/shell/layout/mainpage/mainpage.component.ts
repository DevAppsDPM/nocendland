import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {RouterOutlet} from "@angular/router";
import {SideNavService} from "@shell/state/side-nav.service";
import {HeaderComponent} from "../header/header.component";
import {UserInfoComponent} from "@shell/layout/user-info/user-info.component";
import {SideNavMenuComponent} from "../side-nav-menu/side-nav-menu.component";
import {ColumnCenterContainerComponent} from '@shared/ui/column-center-container'
import {environment} from '@environments/environment';
import {AreaThemeService} from '@shell/navigation/area-theme.service'

@Component({
    selector: 'app-mainpage',
    imports: [
        RouterOutlet,
        HeaderComponent,
        UserInfoComponent,
        SideNavMenuComponent,
        ColumnCenterContainerComponent,
    ],
    templateUrl: './mainpage.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {

  readonly sideNavService = inject(SideNavService)
  protected readonly activeArea = inject(AreaThemeService).area

  protected readonly environment = environment
}
