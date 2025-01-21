import { Component } from '@angular/core';
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"
import {IntakeService} from "@modules/llimbro/services/intake.service"
import {CalendarComponent} from "@shared/components/calendar/calendar.component"
import {NUTRITION_INGREDIENT, NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT} from "@data/types/llimbro"
import {IngredientService} from "@modules/llimbro/services/ingredient.service"
import {ObjectivesService} from "@modules/llimbro/services/objectives.service"

@Component({
  selector: 'app-objectives',
  standalone: true,
  imports: [
    ColumnCenterContainerComponent,
    CalendarComponent
  ],
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.scss'
})
export class ObjectivesComponent {
  protected calories     : number = 0
  protected proteins     : number = 0
  protected carbohydrates: number = 0
  protected fats         : number = 0

  constructor(protected objectivesService: ObjectivesService, protected intakeService: IntakeService, protected ingredientService: IngredientService) {}

  protected dateSelected(dateSelected: Date): void {
    setTimeout(() => this.getObjectiveProgress(dateSelected))
  }

  private async getObjectiveProgress(dateSelected: Date): Promise<void> {
    this.objectivesService.readObjectiveSumByDate(dateSelected)
    // const intakes: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[] = await this.intakeService.readIntakesByDate(dateSelected)
    // const ingredients = await this.ingredientService.readIngredientListByIdList(intakes.map((intake: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT): number => intake.ingredient))
    // console.log(ingredients)
    // ingredients.map((ingredient: NUTRITION_INGREDIENT) => {
    //   this.calories      += ingredient.calories_per_100 || 0
    //   this.proteins      += ingredient.proteins_per_100 || 0
    //   this.carbohydrates += ingredient.carbohydrates_per_100 || 0
    //   this.fats          += ingredient.fats_per_100 || 0
    // })
  }
}
