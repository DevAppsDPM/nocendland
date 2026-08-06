import {Component, signal, WritableSignal, ChangeDetectionStrategy} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms"
import {MatSelectModule} from '@angular/material/select';
import {CalendarComponent} from "@shared/ui/calendar/calendar.component"
import {MatDivider} from "@angular/material/divider"
import {MatIcon} from "@angular/material/icon"
import {MatIconButton} from "@angular/material/button"
import {NutritionStore} from "@areas/llimbro/nutrition/state/nutrition.store"
import {DataListComponent, DataListConfig} from "@shared/ui/data-list/data-list.component"
import {NutritionIngredient, NutritionIntake, NutritionIntakeWithIngredient} from "@areas/llimbro/nutrition/models/nutrition.models"
import {formatDateForDatabase, formatDateForDisplay} from "@shared/utilities/date.utils"
import {IntakeViewerComponent} from '@areas/llimbro/nutrition/intakes/ui/intake-viewer/intake-viewer.component';
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
    DataListComponent,
    MatExpansionModule,
  ],
  templateUrl: './intake.component.html',
  styleUrl: './intake.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: '' },
  ]
})
export class IntakeComponent {

  protected multiSelection: WritableSignal<boolean> = signal(true)
  protected deleteMode: WritableSignal<boolean> = signal(false)
  protected selectingIngredients: WritableSignal<boolean> = signal(false)

  protected selectIngredientListConfig: DataListConfig = {
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
    loading: () => this.nutritionStore.loadingIngredientList()
  }

  protected intakeListConfig: DataListConfig = {
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
    loading: () => this.nutritionStore.loadingIntakeJoinIngredientList()
  }

  constructor(
    private dialog: MatDialog,
    protected nutritionStore: NutritionStore,
  ) { }

  protected dateSelected(dateSelected: Date): void {
    this.nutritionStore.selectDate(dateSelected)
  }

  private reloadIngredientList(): void {
    this.nutritionStore.loadIngredientList()
  }

  private reloadIntakeJoinIngredientList(): void {
    this.nutritionStore.loadIntakeJoinIngredientList()
  }

  private async saveIntakes(ingredients: NutritionIngredient[]) {
    let intakes: NutritionIntake[] = ingredients.map(ingredient => {
      let intake: NutritionIntake = {
        date: formatDateForDatabase(this.nutritionStore.dateSelected()),
        ingredient: ingredient.id
      }

      return intake
    })

    const intakesSaved = await this.nutritionStore.saveIntakeList(intakes)

    this.selectingIngredients.set(false)
    await this.nutritionStore.loadIntakeJoinIngredientList()

    // Si solo hay un intake, lo abrimos directamente.
    if (intakesSaved.length === 1) {
      const newIntakeIndex: number = this.nutritionStore.intakeJoinIngredientList().findIndex((intake: NutritionIntakeWithIngredient): boolean => intake.id === intakesSaved[0].id)
      if (newIntakeIndex < 0) return
      this.openIntakeDialog(newIntakeIndex)
    }
  }

  /**
   * Función que abre el diálogo de intake o ejecuta la función de borrar intake en base a {@link deleteMode}
   * @param intakes
   * @param index para la función de {@link openIntakeDialog}
   */
  public getIntakeListConfirmationMethod(intakes: NutritionIntake[], index: number): void {
    if (!this.deleteMode()) this.openIntakeDialog(index)
    else {
      const intakeIdList: (undefined | number)[] = intakes.map(intake => intake.id)
      this.nutritionStore.deleteIntakes(intakeIdList.filter((intake): intake is number => intake !== undefined))
    }
  }

  protected readonly formatDateForDisplay = formatDateForDisplay

  public openIntakeDialog(currentIndex: number): void {
    const dialogConfig = {
      width: '400px',  // Tamaño del diálogo
      data: {
        currentIndex: currentIndex,  // Pasar el currentIndex como dato
      }
    };

    this.dialog.open(IntakeViewerComponent, dialogConfig).afterClosed().subscribe(() =>{
      this.nutritionStore.loadIntakeJoinIngredientList()
    })
  }

}
