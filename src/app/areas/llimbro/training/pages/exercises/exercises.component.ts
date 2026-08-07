import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core'
import {NavigationService} from '@shell/navigation/navigation.service'
import {DataListComponent, DataListConfig, DataListItem} from '@shared/ui/data-list'
import {TrainingExerciseListItem} from '../../models/training.models'
import {TrainingStore} from '../../state/training.store'

@Component({
  selector: 'app-exercises',
  imports: [DataListComponent],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ExercisesComponent {
  protected readonly store = inject(TrainingStore)
  private readonly navigation = inject(NavigationService)
  protected readonly archiveMode = signal(false)
  protected readonly items = computed<readonly DataListItem<TrainingExerciseListItem>[]>(() =>
    this.store.exercises().map(exercise => ({
      id: exercise.id,
      value: exercise,
      title: exercise.name,
      details: exercise.description ? [exercise.description] : ['Sin descripción'],
      imageUrl: exercise.imageUrl,
      searchText: [exercise.name, exercise.description, ...exercise.tips].filter(Boolean).join(' '),
    })),
  )
  protected readonly config: DataListConfig<TrainingExerciseListItem> = {
    label: 'Ejercicios',
    actions: {
      reload: () => this.store.loadExercises(),
      confirm: exercises => this.handleSelection(exercises),
    },
    multiple: this.archiveMode,
    showSelectionConfirmation: true,
    confirmationIcon: 'delete',
    loading: this.store.loadingExercises,
  }

  protected openForm(id: number | 'new'): void {
    void this.navigation.to('training', 'exercise-form', String(id))
  }

  protected toggleArchiveMode(): void {
    this.archiveMode.update(active => !active)
  }

  private handleSelection(exercises: readonly TrainingExerciseListItem[]): void {
    if (!this.archiveMode()) {
      const exercise = exercises[0]
      if (exercise) this.openForm(exercise.id)
      return
    }
    void Promise.all(exercises.map(exercise => this.store.archiveExercise(exercise.id)))
      .finally(() => this.archiveMode.set(false))
  }
}
