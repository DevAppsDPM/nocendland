import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IngredientsListComponent } from "@modules/nutrition/components/ingredients-list/ingredients-list.component";
import { NavigateService } from '@core/services/navigate.service';
import { STRING } from '@data/constants/STRING';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { IntakeService } from '@modules/nutrition/services/intake.service';
import { NUTRITION_INGREDIENT, NUTRITION_INTAKE } from '@data/types/llimbro';

@Component({
    selector: 'app-select-ingredients',
    imports: [
        IngredientsListComponent,
        MatIcon,
        MatIconButton
    ],
    templateUrl: './select-ingredients.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './select-ingredients.component.scss'
})
export class SelectIngredientsComponent {
  protected readonly STRING = STRING

  constructor(protected navigate: NavigateService, private intakeService: IntakeService) { }

  protected saveIntakes(ingredients: NUTRITION_INGREDIENT[]) {
    const today = new Date()
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-')
    const intakes: NUTRITION_INTAKE[] = ingredients.map(ingredient => ({
      date,
      ingredient: ingredient.id
    }))

    this.intakeService.saveIntakes(intakes).finally(() => this.navigate.to('nutrition', 'intakes'))
  }
}
