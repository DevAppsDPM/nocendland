import {Component, EventEmitter, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {ROUTES} from "@data/constants/ROUTES";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {STRING} from "@data/constants/STRING";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NutritionService} from "@modules/llimbro/services/nutrition.service"
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component";
import { NUTRITION_INGREDIENT } from '@app/data/types/llimbro';
import { IngredientsListComponent } from "../ingredients-list/ingredients-list.component";

@Component({
    selector: 'app-ingredients',
    imports: [
        NgIf,
        MatIcon,
        MatIconButton,
        MatProgressBar,
        ColumnCenterContainerComponent,
        IngredientsListComponent
    ],
    templateUrl: './ingredients.component.html',
    styleUrl: './ingredients.component.scss'
})
export class IngredientsComponent {
  public showList: boolean = true
  public deleteMode: boolean = false

  @Output() ingredientSelected: EventEmitter<NUTRITION_INGREDIENT> = new EventEmitter<NUTRITION_INGREDIENT>
  
  constructor(public nutritionService: NutritionService, private router: Router) {
  }

  protected ingredientsEmitted(ingredients: NUTRITION_INGREDIENT[]): void {
    if (this.deleteMode) this.deleteIngredients(ingredients)
    else this.navigateToIngredientForm(ingredients[0].id)
  }
  
  private deleteIngredients(ingredients: NUTRITION_INGREDIENT[]): void {
    this.nutritionService.ingredient.deleteIngredients(ingredients)
      .finally(() => this.nutritionService.ingredient.readIngredients()) 
      .finally(() => this.toggleDeleteMode())
  }
  
  protected navigateToIngredientForm(ingredientId: number | 'new'): void {
    const route: string = this.nutritionService.routeBase() + ROUTES.MODULES.LLIMBRO.INGREDIENT.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.INGREDIENT.INGREDIENT_FORM + '/' + ingredientId
    console.log(route)
    this.router.navigateByUrl(route)
  }

  protected toggleDeleteMode(): void {
    this.showList = false
    this.deleteMode = !this.deleteMode
    setTimeout(() => this.showList = true, 1);
  }
  
  protected readonly STRING = STRING;
}
