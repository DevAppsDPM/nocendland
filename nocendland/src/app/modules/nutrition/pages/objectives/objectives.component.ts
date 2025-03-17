import {Component, effect} from '@angular/core';
import {NutritionService} from "@modules/nutrition/services/nutrition.service"
import {
  DPM_PROGRESS_VIEWER_CONFIG,
  DpmProgressViewerComponent
} from "@core/components/dpm-progress-viewer/dpm-progress-viewer.component"
import {MatIcon} from "@angular/material/icon"
import {MatIconButton} from "@angular/material/button"
import {STRING} from "@data/constants/STRING"
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog"
import {NavigateService} from "@core/services/navigate.service"
import {ObjectiveConfigComponent} from "@modules/nutrition/pages/objective-config/objective-config.component"
import {NUTRITION_OBJECTIVE} from "@data/types/llimbro"

@Component({
  selector: 'app-objectives',
  imports: [
    DpmProgressViewerComponent,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.scss',
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: '' },
  ]
})
export class ObjectivesComponent {

  private STRINGS = STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INGREDIENT.FORM_LABELS
  protected progressConfigList: DPM_PROGRESS_VIEWER_CONFIG[] = []

  constructor(
    protected nutritionService: NutritionService,
    protected navigate: NavigateService,
    private dialog: MatDialog,
  ) {
    this.effectObjectives()
  }

  private setProgressConfigList(): void {
    if (!this.nutritionService.objectives()) return

    const objective: NUTRITION_OBJECTIVE | undefined = this.nutritionService.objectiveList().find(objective => objective.level === 'keep')
    if (!objective) return

    this.progressConfigList = [
      { title: this.STRINGS.CALORIES, value: this.nutritionService.objectives()?.calories || 0, objetive: objective.calories},
      { title: this.STRINGS.PROTEINS, value: this.nutritionService.objectives()?.proteins || 0, objetive: objective.proteins},
      { title: this.STRINGS.CARBOHYDRATES, value: this.nutritionService.objectives()?.carbohydrates || 0, objetive: objective.carbohydrates},
      { title: this.STRINGS.FATS, value: this.nutritionService.objectives()?.fats || 0, objetive: objective.fats},
    ]
  }

  protected openDialogObjectiveConfig(): void {
    this.dialog.open(ObjectiveConfigComponent, {})
  }

  /* EFFECTS */

  private effectObjectives(): void {
    effect(() => {
      this.nutritionService.objectives()
      this.setProgressConfigList()
    });
  }

  protected readonly STRING = STRING
}
