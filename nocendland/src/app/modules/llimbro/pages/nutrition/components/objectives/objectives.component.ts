import { Component } from '@angular/core';
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"
import {IntakeService} from "@modules/llimbro/services/intake.service"
import {CalendarComponent} from "@shared/components/calendar/calendar.component"
import {
  NUTRITION_INGREDIENT,
  NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT,
  NUTRITION_OBJETIVES_TOTALS
} from "@data/types/llimbro"
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
    const totals: NUTRITION_OBJETIVES_TOTALS = await this.objectivesService.readObjectiveSumByDate(dateSelected)
    this.calories = totals.calories || 0
    this.proteins = totals.proteins || 0
    this.carbohydrates = totals.carbohydrates || 0
    this.fats = totals.fats || 0

  }
}
