import {Component} from '@angular/core';
import {MatDialog, MatDialogModule} from "@angular/material/dialog"
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms"
import {NgIf} from "@angular/common"
import {MatFormField, MatLabel} from "@angular/material/form-field"
import {MatInput} from "@angular/material/input"
import {STRING} from "@data/constants/STRING"
import {NUTRITION_OBJECTIVE, NUTRITION_OBJETIVES_LEVELS} from "@data/types/llimbro"
import {CoreService} from "@core/services/core.service"
import {ApiNutritionObjetiveService} from "@api/services/api-nutrition-objetive.service"
import {NutritionService} from "@modules/nutrition/services/nutrition.service"

@Component({
  selector: 'app-objective-config',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogModule
  ],
  templateUrl: './objective-config.component.html',
  styleUrl: './objective-config.component.scss',
  providers: [MatDialog]
})
export class ObjectiveConfigComponent {

  private levels: NUTRITION_OBJETIVES_LEVELS[] = ['keep', 'good', 'top']
  protected objectiveConfigFormList: FormGroup[] = []

  constructor(
    private formBuilder: FormBuilder,
    protected core: CoreService,
    private apiNutritionObjetiveService: ApiNutritionObjetiveService,
    private nutritionService: NutritionService,
  ) {
    this.buildForm()
  }

  private buildForm(): void {
    this.levels.map((level: NUTRITION_OBJETIVES_LEVELS) => {
      const objective: NUTRITION_OBJECTIVE | undefined = this.nutritionService.objectiveList().find(objective => objective.level === level)
      // if (!objective) return

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

  protected saveObjetiveConfig(): void {
    const objectiveList: NUTRITION_OBJECTIVE[] = this.objectiveConfigFormList.map((form: FormGroup) => {
      return {
        level: form.controls["level"].value,
        proteins: form.controls["proteins"].value,
        carbohydrates: form.controls["carbohydrates"].value,
        fats: form.controls["fats"].value,
        calories: form.controls["calories"].value,
        id_user: ''
      }
    });

    this.apiNutritionObjetiveService.saveObjectiveList(objectiveList)
      .then(() => this.nutritionService.loadObjectiveList())
  }

  protected readonly STRING = STRING
}
