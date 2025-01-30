import { Component } from '@angular/core';
import { IngredientsListComponent } from "../../ingredient/ingredients-list/ingredients-list.component";
import { NavigateService } from '@app/shared/services/navigate.service';
import { STRING } from '@app/data/constants/STRING';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { IntakeService } from '@app/modules/llimbro/services/intake.service';
import { NUTRITION_INGREDIENT, NUTRITION_INTAKE } from '@app/data/types/llimbro';

@Component({
    selector: 'app-select-ingredients',
    imports: [
        IngredientsListComponent,
        MatIcon,
        MatIconButton
    ],
    templateUrl: './select-ingredients.component.html',
    styleUrl: './select-ingredients.component.scss'
})
export class SelectIngredientsComponent {
  protected readonly STRING = STRING

  constructor(protected navigate: NavigateService, private intakeService: IntakeService) { }
  
  protected saveIntakes(ingredients: NUTRITION_INGREDIENT[]) {
    let intakes: NUTRITION_INTAKE[] = ingredients.map(ingredient => {
      let intake: NUTRITION_INTAKE = {
        date: new Date(),
        ingredient: ingredient.id
      }

      return intake
    })
    this.intakeService.saveIntakes(intakes).finally(() => this.navigate.to('intake-view'))
  }
}
