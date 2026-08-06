import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatDialog, MatDialogModule} from "@angular/material/dialog"
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms"

import {MatFormField, MatLabel} from "@angular/material/form-field"
import {MatInput} from "@angular/material/input"
import {NUTRITION_TEXT} from "@areas/llimbro/nutrition/nutrition.constants"
import {NutritionObjective, NutritionObjectiveLevel} from "@areas/llimbro/nutrition/models/nutrition.models"
import {selectInputContent} from "@shared/utilities/input.utils"
import {NutritionStore} from "@areas/llimbro/nutrition/state/nutrition.store"
import {DeviceService} from "@platform/browser/device.service"

@Component({
  selector: 'app-objective-config',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogModule
],
  templateUrl: './objective-config.component.html',
  styleUrl: './objective-config.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [MatDialog]
})
export class ObjectiveConfigComponent {

  private levels: NutritionObjectiveLevel[] = ['keep', 'good', 'top']
  protected objectiveConfigFormList: FormGroup[] = []

  constructor(
    protected device: DeviceService,
    private formBuilder: FormBuilder,
    private nutritionStore: NutritionStore,
  ) {
    this.buildForm()
  }

  private buildForm(): void {
    this.levels.map((level: NutritionObjectiveLevel) => {
      const objective: NutritionObjective | undefined = this.nutritionStore.objectiveList().find(objective => objective.level === level)
      this.objectiveConfigFormList.push(
        this.formBuilder.group({
          level: [level],
          proteins: [objective?.proteins || 0],
          carbohydrates: [objective?.carbohydrates || 0],
          fats: [objective?.fats || 0],
          calories: [objective?.calories || 0],
        })
      )
    })
  }

  protected saveObjectiveConfig(): void {
    const objectiveList: NutritionObjective[] = this.objectiveConfigFormList.map((form: FormGroup) => {
      return {
        level: form.controls["level"].value,
        proteins: form.controls["proteins"].value,
        carbohydrates: form.controls["carbohydrates"].value,
        fats: form.controls["fats"].value,
        calories: form.controls["calories"].value,
        id_user: ''
      }
    });

    void this.nutritionStore.saveObjectives(objectiveList)
  }

  protected readonly text = NUTRITION_TEXT
  protected readonly selectInputContent = selectInputContent
}
