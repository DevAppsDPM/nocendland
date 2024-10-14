import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {MatTabChangeEvent, MatTabGroup, MatTabsModule} from "@angular/material/tabs";
import {STRING} from "@data/constants/STRING";
import {IngredientComponent} from "./components/ingredient/ingredient.component";
import {ROUTES} from "@data/constants/ROUTES";
import {Router, RouterOutlet} from "@angular/router";
import {NutritionService} from "@modules/llimbro/services/nutrition.service"
import {ObjectivesComponent} from "@modules/llimbro/pages/nutrition/components/objectives/objectives.component"
import {IntakeComponent} from "@modules/llimbro/pages/nutrition/components/intake/intake.component"
import {FOOTER_BUTTON, FooterService} from "@shared/services/layout/footer.service"

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [
    MatTabsModule,
    IngredientComponent,
    ObjectivesComponent,
    IntakeComponent,
    RouterOutlet,
  ],
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.scss'
})
export class NutritionComponent implements AfterViewInit, OnDestroy {
  private footerButtons: FOOTER_BUTTON[] = [
    { icon: 'lunch_dining', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INGREDIENT.NAME, action: () => this.navigateNutritionModule(ROUTES.MODULES.LLIMBRO.INGREDIENT_LIST)},
    { icon: 'calendar_month', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INTAKE.NAME, action: () => this.navigateNutritionModule(ROUTES.MODULES.LLIMBRO.INTAKE)},
    { icon: 'analytics', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.OBJECTIVES.NAME, action: () => this.navigateNutritionModule(ROUTES.MODULES.LLIMBRO.OBJECTIVES)},
  ]

  private mainTab: number = 1
  private NUTRITION_MODULES: Record<number, string> = {
    0: ROUTES.MODULES.LLIMBRO.INGREDIENT_LIST,
    1: ROUTES.MODULES.LLIMBRO.INTAKE,
    2: ROUTES.MODULES.LLIMBRO.OBJECTIVES,
  }

  @ViewChild(MatTabGroup) tabs!:  MatTabGroup;

  constructor(private footerService: FooterService, private router: Router, private nutritionService: NutritionService) {
    this.footerService.buttons.set(this.footerButtons)
    this.footerService.showingFooter.set(true)
  }

  ngAfterViewInit(): void {
    this.tabs.selectedIndex = this.mainTab
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


