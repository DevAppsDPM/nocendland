import {NgForOf, NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatListModule, MatListOption} from '@angular/material/list';
import {RESOURCES} from '@app/data/constants/RESOURCES';
import {STRING} from '@app/data/constants/STRING';
import {NUTRITION_INGREDIENT} from '@app/data/types/llimbro';
import {NutritionService} from '@modules/nutrition/services/nutrition.service';

@Component({
    selector: 'app-ingredients-list',
  imports: [
    MatListModule,
    NgForOf,
    NgIf,
    MatIcon,
    MatFabButton
  ],
    templateUrl: './ingredients-list.component.html',
    styleUrl: './ingredients-list.component.scss'
})
export class IngredientsListComponent {
  protected readonly STRING = STRING;
  protected readonly RESOURCES = RESOURCES;

  @Input() multiSelection: boolean = false
  @Input() activateConfirm: boolean = true
  @Input() iconConfirm: string = 'done'

  @Output() ingredientsEmitter: EventEmitter<NUTRITION_INGREDIENT[]> = new EventEmitter<NUTRITION_INGREDIENT[]>()

  constructor(public nutritionService: NutritionService) {
    this.nutritionService.ingredient.readIngredients()
    this.nutritionService.ingredient.readImages()
  }

  protected emitIngredients(ingredientsSelected: MatListOption[]): void {
    this.ingredientsEmitter.emit(ingredientsSelected.map(selected => selected.value))
  }

  protected emitIngredient(ingredient: NUTRITION_INGREDIENT): void {
    this.ingredientsEmitter.emit([ingredient])
  }
}
