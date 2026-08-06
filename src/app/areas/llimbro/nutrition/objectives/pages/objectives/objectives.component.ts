import {Component, computed, ChangeDetectionStrategy} from '@angular/core';
import {NutritionStore} from "@areas/llimbro/nutrition/state/nutrition.store"
import {
  ProgressViewerConfig,
  ProgressViewerComponent
} from "@shared/ui/progress-viewer/progress-viewer.component"
import {MatIcon} from "@angular/material/icon"
import {MatIconButton} from "@angular/material/button"
import {NUTRITION_TEXT} from "@areas/llimbro/nutrition/nutrition.constants"
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog"
import {NavigationService} from "@shell/navigation/navigation.service"
import {ObjectiveConfigComponent} from '@areas/llimbro/nutrition/objectives/ui/objective-config/objective-config.component';
import {NutritionObjective} from "@areas/llimbro/nutrition/models/nutrition.models"

@Component({
  selector: 'app-objectives',
  imports: [
    ProgressViewerComponent,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: '' },
  ]
})
export class ObjectivesComponent {

  private readonly formLabels = NUTRITION_TEXT.ingredients.formLabels
  protected readonly progressConfigList = computed<ProgressViewerConfig[]>(() => {
    const totals = this.nutritionStore.objectives()
    const objective = this.nutritionStore.objectiveList().find(item => item.level === 'keep')
    if (!totals) return []

    return [
      {title: this.formLabels.calories, value: Math.round(totals.calories ?? 0), objective: objective?.calories ?? 0},
      {title: this.formLabels.proteins, value: Math.round(totals.proteins ?? 0), objective: objective?.proteins ?? 0},
      {title: this.formLabels.carbohydrates, value: Math.round(totals.carbohydrates ?? 0), objective: objective?.carbohydrates ?? 0},
      {title: this.formLabels.fats, value: Math.round(totals.fats ?? 0), objective: objective?.fats ?? 0},
    ]
  })

  constructor(
    protected nutritionStore: NutritionStore,
    protected navigation: NavigationService,
    private dialog: MatDialog,
  ) {}

  protected openDialogObjectiveConfig(): void {
    this.dialog.open(ObjectiveConfigComponent, {})
  }

  protected readonly text = NUTRITION_TEXT
}
