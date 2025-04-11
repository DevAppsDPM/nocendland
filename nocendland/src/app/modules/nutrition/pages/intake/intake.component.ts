import {Component, signal, WritableSignal} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms"
import {MatSelectModule} from '@angular/material/select';
import {CalendarComponent} from "@shared/components/calendar/calendar.component"
import {MatDivider} from "@angular/material/divider"
import {MatIcon} from "@angular/material/icon"
import {MatIconButton} from "@angular/material/button"
import {NutritionService} from "@modules/nutrition/services/nutrition.service"
import {DPMlistingComponent, DPMlistingConfig} from "@shared/components/dpmlisting/dpmlisting.component"
import {NgIf} from "@angular/common"
import {ApiNutritionIntakeService} from "@api/services/api-nutrition-intake.service"
import {NUTRITION_INGREDIENT, NUTRITION_INTAKE} from "@data/types/llimbro"
import {CoreService} from "@core/services/core.service"
import {IntakeViewerComponent} from "@modules/nutrition/components/intake-viewer/intake-viewer.component"
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog"
import {MatExpansionModule} from "@angular/material/expansion"

@Component({
  selector: 'app-intake',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    CalendarComponent,
    MatDivider,
    MatIcon,
    MatIconButton,
    DPMlistingComponent,
    NgIf,
    MatExpansionModule,
  ],
  templateUrl: './intake.component.html',
  styleUrl: './intake.component.scss',
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: '' },
  ]
})
export class IntakeComponent {

  protected multiSelection: WritableSignal<boolean> = signal(true)
  protected deleteMode: WritableSignal<boolean> = signal(false)
  protected selectingIngredients: WritableSignal<boolean> = signal(false)

  protected selectIngredientListConfig: DPMlistingConfig = {
    columnConfig: {
      title: 'name',
    },
    actions: {
      confirm: (intakes) => this.saveIntakes(intakes)
    },
    multiSelection: this.multiSelection,
    activateConfirm: true,
    iconConfirm: 'add',
  }

  protected intakeListConfig: DPMlistingConfig = {
    columnConfig: {
      title: 'nutrition_ingredient.name',
      lines: ['quantity_in_grams']
    },
    actions: {
      confirm: (intakes, index) => this.getIntakeListConfirmationMethod(intakes, index || 0)
    },
    multiSelection: this.deleteMode,
    activateConfirm: true,
    iconConfirm: 'delete',
  }

  constructor(
    private apiIntakeService: ApiNutritionIntakeService,
    private dialog: MatDialog,
    protected nutritionService: NutritionService,
    protected core: CoreService
  ) { }

  protected dateSelected(dateSelected: Date): void {
    setTimeout(() => this.nutritionService.dateSelected.set(dateSelected))
  }

  private saveIntakes(ingredients: NUTRITION_INGREDIENT[]) {
    let intakes: NUTRITION_INTAKE[] = ingredients.map(ingredient => {
      let intake: NUTRITION_INTAKE = {
        date: this.core.getDateStringForDB(this.nutritionService.dateSelected()),
        ingredient: ingredient.id
      }

      return intake
    })

    this.apiIntakeService.saveIntakeList(intakes)
      .then(() => this.nutritionService.reloadDateSelectedDependent())
      .finally(() => this.selectingIngredients.set(false))
      .finally(() => this.nutritionService.loadIntakeJoinIngredientList())
  }

  /**
   * Función que abre el diálogo de intake o ejecuta la función de borrar intake en base a {@link deleteMode}
   * @param intakes
   * @param index para la función de {@link openIntakeDialog}
   */
  public getIntakeListConfirmationMethod(intakes: NUTRITION_INTAKE[], index: number): void {
    if (!this.deleteMode()) this.openIntakeDialog(index)
    else {
      const intakeIdList: (undefined | number)[] = intakes.map(intake => intake.id)
      this.apiIntakeService.deleteIntakesByIdList(intakeIdList.filter(intake => intake !== undefined))
        .then(() => this.nutritionService.loadIntakeJoinIngredientList())
    }
  }

  public openIntakeDialog(currentIndex: number): void {
    const dialogConfig = {
      width: '400px',  // Tamaño del dialogo
      data: {
        currentIndex: currentIndex,  // Pasar el currentIndex como dato
      }
    };

    this.dialog.open(IntakeViewerComponent, dialogConfig);
  }

}
