import {Component} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {Router, RouterOutlet} from "@angular/router";
import {SupabaseService} from "../../api/services/supabase.service";
import {SideNavService} from "@shared/services/layout/side-nav.service";
import {HeaderComponent} from "../header/header.component";
import {UserInfoComponent} from "../../shared/components/user-info/user-info.component";
import {SideNavMenuComponent} from "../side-nav-menu/side-nav-menu.component";
import {FooterComponent} from "@layout/footer/footer.component"

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
    ],
    templateUrl: './mainpage.component.html',
    styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {

  constructor(
    private router: Router,
    public supabase: SupabaseService,
    public sideNavService: SideNavService,
  ) {}

  public verSession(): void {
    console.log('session', this.supabase.session)
  }
}
