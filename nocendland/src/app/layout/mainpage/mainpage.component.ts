import {Component, HostListener} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {Router, RouterOutlet} from "@angular/router";
import {SupabaseService} from "@api/services/supabase.service";
import {SideNavService} from "@core/services/layout/side-nav.service";
import {HeaderComponent} from "../header/header.component";
import {UserInfoComponent} from "@shared/components/user-info/user-info.component";
import {SideNavMenuComponent} from "../side-nav-menu/side-nav-menu.component";
import {FooterComponent} from "@layout/footer/footer.component"
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"
import {environment} from "../../../environments/environment"
import {NavigateService} from "@core/services/navigate.service"

@Component({
    selector: 'app-mainpage',
    imports: [
        RouterOutlet,
        MatDrawerContainer,
        MatDrawer,
        HeaderComponent,
        UserInfoComponent,
        SideNavMenuComponent,
        FooterComponent,
        ColumnCenterContainerComponent,
    ],
    templateUrl: './mainpage.component.html',
    styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {

  private touchStartX = 0;
  private touchEndX = 0;

  constructor(
    private router: Router,
    public supabase: SupabaseService,
    public sideNavService: SideNavService,
    private navigate: NavigateService
  ) {}

  public verSession(): void {
    console.log('session', this.supabase.session)
  }

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
      this.navigate.to('nutrition', direction === 'right' ? 'objectives' : 'intakes');
    } else if (currentRoute.includes('nutrition/intakes')) {
      this.navigate.to('nutrition', direction === 'right' ? 'ingredients' : 'objectives');
    } else if (currentRoute.includes('nutrition/objectives')) {
      this.navigate.to('nutrition', direction === 'right' ? 'intakes' : 'ingredients');
    }
  }

  protected readonly environment = environment
}
