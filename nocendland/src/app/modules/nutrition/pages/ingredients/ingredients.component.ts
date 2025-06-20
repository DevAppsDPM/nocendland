import {Component, EventEmitter, Output, signal, WritableSignal} from '@angular/core';
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {STRING} from "@data/constants/STRING";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NutritionService} from "@modules/nutrition/services/nutrition.service"
import {NUTRITION_INGREDIENT} from '@data/types/llimbro';
import {NavigateService} from "@core/services/navigate.service"
import {ApiNutritionIngredientService} from "@api/services/api-nutrition-ingredient.service"
import {DPMlistingComponent, DPMlistingConfig} from "@shared/components/dpmlisting/dpmlisting.component"

/**
 * Page de ingredientes
 */
@Component({
    selector: 'app-ingredients',
  imports: [
    NgIf,
    MatIcon,
    MatIconButton,
    MatProgressBar,
    DPMlistingComponent
  ],
    templateUrl: './ingredients.component.html',
    styleUrl: './ingredients.component.scss'
})
export class IngredientsComponent {

  public showList: boolean = true
  public deleteMode: WritableSignal<boolean> = signal(false)

  protected ingredientListConfig: DPMlistingConfig = {
    columnConfig: {
      title: 'name',
      lines: ['calories_per_100']
    },
    actions: {
      reload: () => this.nutritionService.loadIngredientList(),
      confirm: (ingredients) => this.ingredientsEmitted(ingredients)
    },
    multiSelection: this.deleteMode,
    activateConfirm: true,
    iconConfirm: 'delete',
  }

  @Output() ingredientSelected: EventEmitter<NUTRITION_INGREDIENT> = new EventEmitter<NUTRITION_INGREDIENT>

  constructor(
    public nutritionService: NutritionService,
    private navigate: NavigateService,
    private apiNutritionIngredientService: ApiNutritionIngredientService,
  ) { }

  protected ingredientsEmitted(ingredients: NUTRITION_INGREDIENT | NUTRITION_INGREDIENT[]): void {
    if (this.deleteMode()) this.deleteIngredients(ingredients as NUTRITION_INGREDIENT[])
    else this.navigateToIngredientForm((ingredients as NUTRITION_INGREDIENT).id.toString())
  }

  private deleteIngredients(ingredients: NUTRITION_INGREDIENT[]): void {
    this.apiNutritionIngredientService.deleteIngredients(ingredients)
      .finally(() => this.nutritionService.loadIngredientList())
      .finally(() => this.toggleDeleteMode())
  }

  protected navigateToIngredientForm(ingredientId: string | 'new'): void {
    this.navigate.to('nutrition', 'ingredient-form', ingredientId)
  }

  protected toggleDeleteMode(): void {
    this.showList = false
    this.deleteMode.set(!this.deleteMode())
    setTimeout(() => this.showList = true, 1);
  }

  protected readonly STRING = STRING;
}
