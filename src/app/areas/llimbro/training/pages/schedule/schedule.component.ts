import {ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {DataListComponent, DataListConfig, DataListItem} from '@shared/ui/data-list'
import {TrainingExerciseListItem, TrainingScheduleDraft} from '../../models/training.models'
import {TrainingStore} from '../../state/training.store'
import {getIsoWeekday, TRAINING_WEEKDAYS} from '../../training.constants'

@Component({
  selector: 'app-schedule',
  imports: [FormsModule, DataListComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ScheduleComponent {
  protected readonly store = inject(TrainingStore)
  protected readonly weekdays = TRAINING_WEEKDAYS
  protected readonly selectedWeekday = signal(getIsoWeekday(new Date()))
  protected readonly selectingExercises = signal(false)
  protected readonly dirty = signal(false)
  protected readonly saveError = signal<string | null>(null)
  private readonly multiSelection = signal(true)
  protected readonly drafts = linkedSignal<TrainingScheduleDraft[]>(() => this.store.schedule()
    .filter(item => item.weekday === this.selectedWeekday())
    .map(item => ({
      id: item.id,
      exerciseId: item.exercise_id,
      setCount: item.set_count,
      targetRepetitions: item.target_repetitions,
      targetWeightKg: item.target_weight_kg,
      sortOrder: item.sort_order,
    } satisfies TrainingScheduleDraft)))
  protected readonly selectedDayLabel = computed(() =>
    this.weekdays.find(day => day.id === this.selectedWeekday())?.label ?? '',
  )
  protected readonly exerciseItems = computed<readonly DataListItem<TrainingExerciseListItem>[]>(() => {
    const assigned = new Set(this.drafts().map(draft => draft.exerciseId))
    return this.store.exercises().filter(exercise => !assigned.has(exercise.id)).map(exercise => ({
      id: exercise.id,
      value: exercise,
      title: exercise.name,
      details: exercise.description ? [exercise.description] : undefined,
      imageUrl: exercise.imageUrl,
    }))
  })
  protected readonly exerciseListConfig: DataListConfig<TrainingExerciseListItem> = {
    label: 'Ejercicios disponibles',
    actions: {confirm: exercises => this.addExercises(exercises)},
    multiple: this.multiSelection,
    showSelectionConfirmation: true,
    confirmationIcon: 'add',
    loading: this.store.loadingExercises,
  }

  protected selectWeekday(weekday: number): void {
    this.selectedWeekday.set(weekday)
    this.selectingExercises.set(false)
    this.dirty.set(false)
    this.saveError.set(null)
  }

  protected removeExercise(index: number): void {
    this.drafts.update(drafts => drafts.filter((_, draftIndex) => draftIndex !== index)
      .map((draft, sortOrder) => ({...draft, sortOrder})))
    this.dirty.set(true)
    this.saveError.set(null)
  }

  protected updateNumber(index: number, field: 'setCount' | 'targetRepetitions' | 'targetWeightKg', event: Event): void {
    const raw = (event.target as HTMLInputElement).value
    const value = raw === '' ? null : Number(raw)
    this.drafts.update(drafts => drafts.map((draft, draftIndex) => draftIndex === index ? {
      ...draft,
      [field]: field === 'setCount' ? Math.max(1, Math.trunc(value ?? 1)) : value,
    } : draft))
    this.dirty.set(true)
    this.saveError.set(null)
  }

  protected exerciseName(exerciseId: number): string {
    return this.store.exercises().find(exercise => exercise.id === exerciseId)?.name ?? 'Ejercicio'
  }

  protected async save(): Promise<void> {
    this.saveError.set(null)
    try {
      await this.store.saveScheduleDay(this.selectedWeekday(), this.drafts())
      this.dirty.set(false)
    } catch {
      this.saveError.set('No se ha podido guardar el horario. Inténtalo de nuevo.')
    }
  }

  private addExercises(exercises: readonly TrainingExerciseListItem[]): void {
    this.drafts.update(drafts => [
      ...drafts,
      ...exercises.map((exercise, offset) => ({
        exerciseId: exercise.id,
        setCount: 1,
        targetRepetitions: null,
        targetWeightKg: null,
        sortOrder: drafts.length + offset,
      })),
    ])
    this.selectingExercises.set(false)
    this.dirty.set(true)
    this.saveError.set(null)
  }
}
