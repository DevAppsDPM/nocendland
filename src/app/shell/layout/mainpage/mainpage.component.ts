import {ChangeDetectionStrategy, Component, computed, HostListener, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router, RouterOutlet} from "@angular/router";
import {SideNavService} from "@shell/state/side-nav.service";
import {HeaderComponent} from "../header/header.component";
import {UserInfoComponent} from "@shell/layout/user-info/user-info.component";
import {SideNavMenuComponent} from "../side-nav-menu/side-nav-menu.component";
import {FooterComponent} from "@shell/layout/footer/footer.component"
import {
  ColumnCenterContainerComponent
} from "@shared/ui/column-center-container/column-center-container.component"
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
        FooterComponent,
        ColumnCenterContainerComponent,
    ],
    templateUrl: './mainpage.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {

  private touchStartX = 0;
  private touchEndX = 0;
  private readonly router = inject(Router)
  private readonly navigation = inject(NavigationService)
  readonly sideNavService = inject(SideNavService)
  private readonly navigationUrl = toSignal(
    this.navigation.navigationEnd().pipe(map(event => event.urlAfterRedirects)),
    {initialValue: this.router.url},
  )

  protected readonly activeArea = computed(() => this.navigationUrl().includes('/llimbro') ? 'llimbro' : 'home')

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  private handleSwipeGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    if (Math.abs(deltaX) > 100) { // Umbral mínimo para considerar swipe
      if (deltaX > 0) {
        // Deslizó a la derecha
        if (this.router.url.includes('nutrition')) this.nutritionSwipeGesture('right')
      } else {
        // Deslizó a la izquierda
        if (this.router.url.includes('nutrition')) this.nutritionSwipeGesture('left')
      }
    }
  }

  private nutritionSwipeGesture(direction: 'left' | 'right'): void {
    const currentRoute = this.router.url;

    if (currentRoute.includes('nutrition/ingredients')) {
      this.navigation.to('nutrition', direction === 'right' ? 'objectives' : 'intakes');
    } else if (currentRoute.includes('nutrition/intakes')) {
      this.navigation.to('nutrition', direction === 'right' ? 'ingredients' : 'objectives');
    } else if (currentRoute.includes('nutrition/objectives')) {
      this.navigation.to('nutrition', direction === 'right' ? 'intakes' : 'ingredients');
    }
  }

  protected readonly environment = environment
}
