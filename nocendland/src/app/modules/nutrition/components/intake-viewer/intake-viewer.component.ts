import {
  Component,
  effect,
  ElementRef,
  Inject,
  input,
  OnDestroy,
  Signal,
  signal,
  viewChild,
  WritableSignal
} from '@angular/core';
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
import {CardDataComponent} from "@core/components/card-data/card-data.component"
import {CoreService} from "@core/services/core.service"
import {MatTooltip} from "@angular/material/tooltip"
import {STRING} from "@data/constants/STRING"

@Component({
  selector: 'app-intake-viewer',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatIcon,
    CardDataComponent,
    MatTooltip
  ],
  templateUrl: './intake-viewer.component.html',
  styleUrl: './intake-viewer.component.scss'
})
export class IntakeViewerComponent implements OnDestroy {
  protected currentIndex: WritableSignal<number> = signal(0)

  protected inputQuantity: Signal<ElementRef | undefined> = viewChild<ElementRef>('inputQuantity')

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiNutritionIntakeService: ApiNutritionIntakeService,
    protected nutritionService: NutritionService,
    protected core: CoreService
  ) {
    this.currentIndex.set(this.data.currentIndex) // Asignamos el currentIndex
    this.effectCurrentIndex()
    this.effectInputQuantity()
  }

  ngOnDestroy(): void {
    this.core.util.cancelDebounce()
  }

  get currentIntakeJoinIngredient(): NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT {
    return this.nutritionService.intakeJoinIngredientList()[this.currentIndex()]
  }

  getPrevIngredientName(): string {
    let prevIndex = (this.currentIndex() === 0) ? this.nutritionService.intakeJoinIngredientList().length - 1 : this.currentIndex() - 1;
    return this.nutritionService.intakeJoinIngredientList()[prevIndex]?.nutrition_ingredient.name || '';
  }

  getNextIngredientName(): string {
    let nextIndex = (this.currentIndex() === this.nutritionService.intakeJoinIngredientList().length - 1) ? 0 : this.currentIndex() + 1;
    return this.nutritionService.intakeJoinIngredientList()[nextIndex]?.nutrition_ingredient.name || '';
  }

  prevIngredient() {
    this.currentIndex.set((this.currentIndex() === 0)
      ? this.nutritionService.intakeJoinIngredientList().length - 1  // Si está en el primero, va al último
      : this.currentIndex() - 1)
  }

  nextIngredient() {
    this.currentIndex.set((this.currentIndex() === this.nutritionService.intakeJoinIngredientList().length - 1)
      ? 0  // Si está en el último, vuelve al primero
      : this.currentIndex() + 1)
  }

  saveChanges() {
    this.core.util.debounce(() => {
      let intakeJoinNutrition: any = structuredClone(this.currentIntakeJoinIngredient)
      intakeJoinNutrition.ingredient = intakeJoinNutrition.nutrition_ingredient.id
      delete intakeJoinNutrition.nutrition_ingredient; // Elimina la propiedad
      let intake: NUTRITION_INTAKE = intakeJoinNutrition

      this.nutritionService.savingIntakeJoinIngredientList.set(true)
      this.apiNutritionIntakeService.saveIntake(intake)
        .finally(() => {
          setTimeout(() => this.nutritionService.savingIntakeJoinIngredientList.set(false), 1000)
        })
    }, 1000)
  }

  private selectInputQuantity(): void {
    // Si la cantidad es mayor a 0, no seleccionamos el input
    if (!!this.currentIntakeJoinIngredient.quantity_in_grams && this.currentIntakeJoinIngredient.quantity_in_grams > 0) return

    setTimeout(() => {
      this.inputQuantity()?.nativeElement.focus()
      this.inputQuantity()?.nativeElement.select()
    })
  }

  protected calculateQuantityInGrams(): void {
    const units: number | undefined = this.currentIntakeJoinIngredient.units
    if (!units) return

    console.log('Calculando cantidad en gramos...', units)

    this.currentIntakeJoinIngredient.quantity_in_grams = (this.currentIntakeJoinIngredient.nutrition_ingredient.grams_per_unit || 0) * units
    this.saveChanges()
  }

  /* EFFECTS */
  private effectCurrentIndex(): void {
    effect(() => {
      this.currentIndex()
      this.selectInputQuantity()
    })
  }

  private effectInputQuantity(): void {
    effect(() => {
      this.inputQuantity()
      this.selectInputQuantity()
    })
  }

  protected readonly input = input
  protected readonly parseInt = parseInt
  protected readonly STRING = STRING
}
