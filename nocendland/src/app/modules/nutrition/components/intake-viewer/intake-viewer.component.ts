import {Component, Inject} from '@angular/core';
import {NutritionService} from "@modules/nutrition/services/nutrition.service"
import {MatCardModule} from "@angular/material/card"
import {MatInputModule} from "@angular/material/input"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatButtonModule} from "@angular/material/button"
import {FormsModule} from "@angular/forms"
import {MatIcon} from "@angular/material/icon"
import {ApiNutritionIntakeService} from "@api/services/api-nutrition-intake.service"
import {NUTRITION_INTAKE, NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT} from "@data/types/llimbro"
import {MAT_DIALOG_DATA} from "@angular/material/dialog"
import {Debounce} from "@core/decorators/Debounce"

@Component({
  selector: 'app-intake-viewer',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatIcon
  ],
  templateUrl: './intake-viewer.component.html',
  styleUrl: './intake-viewer.component.scss'
})
export class IntakeViewerComponent {
  currentIndex: number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected nutritionService: NutritionService,
    private apiNutritionIntakeService: ApiNutritionIntakeService
  ) {
    this.currentIndex = data.currentIndex // Asignamos el currentIndex
  }

  get currentIntakeJoinIngredient(): NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT {
    return this.nutritionService.intakeJoinIngredientList()[this.currentIndex]
  }

  getPrevIngredientName(): string {
    let prevIndex = (this.currentIndex === 0) ? this.nutritionService.intakeJoinIngredientList().length - 1 : this.currentIndex - 1;
    return this.nutritionService.intakeJoinIngredientList()[prevIndex]?.nutrition_ingredient.name || '';
  }

  getNextIngredientName(): string {
    let nextIndex = (this.currentIndex === this.nutritionService.intakeJoinIngredientList().length - 1) ? 0 : this.currentIndex + 1;
    return this.nutritionService.intakeJoinIngredientList()[nextIndex]?.nutrition_ingredient.name || '';
  }

  prevIngredient() {
    this.currentIndex = (this.currentIndex === 0)
      ? this.nutritionService.intakeJoinIngredientList().length - 1  // Si está en el primero, va al último
      : this.currentIndex - 1;
  }

  nextIngredient() {
    this.currentIndex = (this.currentIndex === this.nutritionService.intakeJoinIngredientList().length - 1)
      ? 0  // Si está en el último, vuelve al primero
      : this.currentIndex + 1;
  }

  @Debounce(500)
  saveChanges() {
    let intakeJoinNutrition: any = structuredClone(this.currentIntakeJoinIngredient)
    intakeJoinNutrition.ingredient = intakeJoinNutrition.nutrition_ingredient.id
    delete intakeJoinNutrition.nutrition_ingredient; // Elimina la propiedad
    let intake: NUTRITION_INTAKE = intakeJoinNutrition

    this.apiNutritionIntakeService.saveIntake(intake)
      .then(() => this.nutritionService.loadIntakeJoinIngredientList())
  }
}
