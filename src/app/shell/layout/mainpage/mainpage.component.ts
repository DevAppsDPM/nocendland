import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop';
import {Router, RouterOutlet} from "@angular/router";
import {SideNavService} from "@shell/state/side-nav.service";
import {HeaderComponent} from "../header/header.component";
import {UserInfoComponent} from "@shell/layout/user-info/user-info.component";
import {SideNavMenuComponent} from "../side-nav-menu/side-nav-menu.component";
import {ColumnCenterContainerComponent} from '@shared/ui/column-center-container'
import {environment} from '@environments/environment';
import {NavigationService} from "@shell/navigation/navigation.service"
import {map} from 'rxjs';

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

  private readonly router = inject(Router)
  private readonly navigation = inject(NavigationService)
  readonly sideNavService = inject(SideNavService)
  private readonly navigationUrl = toSignal(
    this.navigation.navigationEnd().pipe(map(event => event.urlAfterRedirects)),
    {initialValue: this.router.url},
  )

  protected readonly activeArea = computed(() => this.navigationUrl().includes('/llimbro') ? 'llimbro' : 'home')

  protected readonly environment = environment
}
