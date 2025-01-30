import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {STRING} from "@data/constants/STRING";
import {ROUTES} from "@data/constants/ROUTES";
import {Router, RouterOutlet} from "@angular/router";
import {NutritionService} from "@modules/llimbro/services/nutrition.service"
import {FOOTER_BUTTON, FooterService} from "@shared/services/layout/footer.service"

@Component({
    selector: 'app-nutrition',
  imports: [
    RouterOutlet,
  ],
    templateUrl: './nutrition.component.html',
    styleUrl: './nutrition.component.scss'
})
export class NutritionComponent implements AfterViewInit, OnDestroy {
  private footerButtons: FOOTER_BUTTON[] = [
    { icon: 'lunch_dining', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INGREDIENT.NAME, action: () => this.navigateNutritionModule(ROUTES.MODULES.LLIMBRO.INGREDIENT.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.INGREDIENT.INGREDIENT_LIST)},
    { icon: 'calendar_month', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INTAKE.NAME, action: () => this.navigateNutritionModule(ROUTES.MODULES.LLIMBRO.INTAKE.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.INTAKE.VIEW)},
    { icon: 'analytics', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.OBJECTIVES.NAME, action: () => this.navigateNutritionModule(ROUTES.MODULES.LLIMBRO.OBJECTIVES)},
  ] // TODO: cambiar por navigate service

  private NUTRITION_MODULES: Record<number, string> = {
    0: ROUTES.MODULES.LLIMBRO.INGREDIENT.ROUTE,
    1: ROUTES.MODULES.LLIMBRO.INTAKE.ROUTE,
    2: ROUTES.MODULES.LLIMBRO.OBJECTIVES,
  }

  constructor(private footerService: FooterService, private router: Router, private nutritionService: NutritionService) {
    this.footerService.buttons.set(this.footerButtons)
    this.footerService.showingFooter.set(true)
  }

  ngAfterViewInit(): void {
    this.footerService.onClickButton(this.footerButtons[1])
    // this.tabs.selectedIndex = this.mainTab
  }

  ngOnDestroy(): void {
    this.footerService.showingFooter.set(false)
  }

  public navigateNutritionModule(route: string): void {
    const fullRoute: string = this.nutritionService.routeBase() + route
    console.log(fullRoute)
    this.router.navigateByUrl(fullRoute)
  }

  protected readonly STRING = STRING;
}


