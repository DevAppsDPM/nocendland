import {Component, EventEmitter, Output, signal, WritableSignal, ChangeDetectionStrategy} from '@angular/core';
import {NUTRITION_TEXT} from "@areas/llimbro/nutrition/nutrition.constants";
import {NutritionStore} from "@areas/llimbro/nutrition/state/nutrition.store"
import {NutritionIngredient} from '@areas/llimbro/nutrition/models/nutrition.models';
import {NavigationService} from "@shell/navigation/navigation.service"
import {DataListComponent, DataListConfig} from "@shared/ui/data-list/data-list.component"

/**
 * Página de alimentos.
 */
@Component({
    selector: 'app-ingredients',
  imports: [
    DataListComponent
  ],
    templateUrl: './ingredients.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './ingredients.component.scss'
})
export class IngredientsComponent {

  public showList: boolean = true
  public deleteMode: WritableSignal<boolean> = signal(false)

  protected ingredientListConfig: DataListConfig = {
    columnConfig: {
      title: 'name',
      lines: ['calories_per_100'],
      image: 'image'
    },
    actions: {
      reload: () => this.nutritionStore.loadIngredientList(),
      confirm: (ingredients) => this.ingredientsEmitted(ingredients)
    },
    multiSelection: this.deleteMode,
    activateConfirm: true,
    iconConfirm: 'delete',
    loading: () => this.nutritionStore.loadingIngredientList()
  }

  @Output() ingredientSelected: EventEmitter<NutritionIngredient> = new EventEmitter<NutritionIngredient>

  constructor(
    public nutritionStore: NutritionStore,
    private navigate: NavigationService,
  ) { }

  protected ingredientsEmitted(ingredients: NutritionIngredient | NutritionIngredient[]): void {
    if (this.deleteMode()) this.deleteIngredients(ingredients as NutritionIngredient[])
    else this.navigateToIngredientForm((ingredients as NutritionIngredient).id.toString())
  }

  private deleteIngredients(ingredients: NutritionIngredient[]): void {
    this.nutritionStore.deleteIngredients(ingredients)
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

  protected readonly text = NUTRITION_TEXT;
}
