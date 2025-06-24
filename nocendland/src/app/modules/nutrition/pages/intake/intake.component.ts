import {Component, signal, WritableSignal} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms"
import {MatSelectModule} from '@angular/material/select';
import {CalendarComponent} from "@shared/components/calendar/calendar.component"
import {MatDivider} from "@angular/material/divider"
import {MatIcon} from "@angular/material/icon"
import {MatIconButton} from "@angular/material/button"
import {NutritionService} from "@modules/nutrition/services/nutrition.service"
import {DPMlistingComponent, DPMlistingConfig} from "@shared/components/dpmlisting/dpmlisting.component"
import {ApiNutritionIntakeService} from "@api/services/api-nutrition-intake.service"
import {NUTRITION_INGREDIENT, NUTRITION_INTAKE, NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT} from "@data/types/llimbro"
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
      image: 'image'
    },
    actions: {
      reload: () => this.reloadIngredientList(),
      confirm: (intakes) => this.saveIntakes(intakes)
    },
    multiSelection: this.multiSelection,
    activateConfirm: true,
    iconConfirm: 'add',
    loading: () => this.nutritionService.loadingIngredientList()
  }

  protected intakeListConfig: DPMlistingConfig = {
    columnConfig: {
      title: 'nutrition_ingredient.name',
      lines: ['quantity_in_grams'],
      image: 'nutrition_ingredient.image_route',
    },
    actions: {
      reload: () => this.reloadIntakeJoinIngredientList(),
      confirm: (intakes, index) => this.getIntakeListConfirmationMethod(intakes, index || 0)
    },
    multiSelection: this.deleteMode,
    activateConfirm: true,
    iconConfirm: 'delete',
    loading: () => this.nutritionService.loadingIntakeJoinIngredientList()
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

  private reloadIngredientList(): void {
    this.nutritionService.loadIngredientList()
  }

  private reloadIntakeJoinIngredientList(): void {
    this.nutritionService.loadIntakeJoinIngredientList()
  }

  private async saveIntakes(ingredients: NUTRITION_INGREDIENT[]) {
    let intakes: NUTRITION_INTAKE[] = ingredients.map(ingredient => {
      let intake: NUTRITION_INTAKE = {
        date: this.core.getDateStringForDB(this.nutritionService.dateSelected()),
        ingredient: ingredient.id
      }

      return intake
    })

    const intakesSaved = await this.apiIntakeService.saveIntakeList(intakes)
    await this.nutritionService.reloadDateSelectedDependent()

    this.selectingIngredients.set(false)
    await this.nutritionService.loadIntakeJoinIngredientList()

    // Si solo hay un intake, lo abrimos directamente.
    if (intakesSaved.length === 1) {
      const newIntakeIndex: number = this.nutritionService.intakeJoinIngredientList().findIndex((intake: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT): boolean => intake.id === intakesSaved[0].id)
      if (newIntakeIndex < 0) return
      this.openIntakeDialog(newIntakeIndex)
    }
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
      width: '400px',  // Tamaño del diálogo
      data: {
        currentIndex: currentIndex,  // Pasar el currentIndex como dato
      }
    };

    this.dialog.open(IntakeViewerComponent, dialogConfig).afterClosed().subscribe(() =>{
      this.nutritionService.loadIntakeJoinIngredientList()
    })
  }

}
