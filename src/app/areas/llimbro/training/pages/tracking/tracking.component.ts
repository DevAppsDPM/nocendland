import {ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal} from '@angular/core'
import {CalendarComponent} from '@shared/ui/calendar'
import {DataListComponent, DataListConfig, DataListItem} from '@shared/ui/data-list'
import {formatDateForDisplay} from '@shared/utilities/date.utils'
import {TrainingEntryDraft, TrainingExerciseListItem, TrainingSetDraft} from '../../models/training.models'
import {TrainingStore} from '../../state/training.store'
import {getIsoWeekday} from '../../training.constants'

type EditableSet = TrainingSetDraft & {clientId: string}
type EditableEntry = Omit<TrainingEntryDraft, 'sets'> & {clientId: string; sets: EditableSet[]}

@Component({
  selector: 'app-tracking',
  imports: [CalendarComponent, DataListComponent],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TrackingComponent {
  protected readonly store = inject(TrainingStore)
  protected readonly selectingExercises = signal(false)
  protected readonly dirty = signal(false)
  private readonly multiSelection = signal(true)
  protected readonly drafts = linkedSignal<
    {date: Date; entries: ReturnType<TrainingStore['entries']>},
    EditableEntry[]
  >({
    source: () => ({date: this.store.selectedDate(), entries: this.store.entries()}),
    computation: ({entries}) => entries.map(entry => ({
      id: entry.id,
      clientId: `entry-${entry.id}`,
      exerciseId: entry.exercise_id,
      sortOrder: entry.sort_order,
      sets: entry.training_set.map(set => ({
        id: set.id,
        clientId: `set-${set.id}`,
        position: set.position,
        repetitions: set.repetitions,
        weightKg: set.weight_kg,
      })),
    })),
  })
  protected readonly availableExercises = computed<TrainingExerciseListItem[]>(() => {
    const registered = new Set(this.drafts().map(entry => entry.exerciseId))
    return this.store.exercises().filter(exercise => !registered.has(exercise.id))
  })
  protected readonly exerciseItems = computed<readonly DataListItem<TrainingExerciseListItem>[]>(() =>
    this.availableExercises().map(exercise => ({
      id: exercise.id,
      value: exercise,
      title: exercise.name,
      details: exercise.description ? [exercise.description] : undefined,
      imageUrl: exercise.imageUrl,
    })),
  )
  protected readonly plannedSelectionIds = computed<readonly number[]>(() => {
    const available = new Set(this.availableExercises().map(exercise => exercise.id))
    const weekday = getIsoWeekday(this.store.selectedDate())
    return this.store.schedule().filter(item => item.weekday === weekday && available.has(item.exercise_id))
      .map(item => item.exercise_id)
  })
  protected readonly exerciseListConfig: DataListConfig<TrainingExerciseListItem> = {
    label: 'Ejercicios disponibles',
    actions: {confirm: exercises => this.addEntries(exercises)},
    multiple: this.multiSelection,
    showSelectionConfirmation: true,
    confirmationIcon: 'add',
    loading: this.store.loadingExercises,
    initialSelectedIds: this.plannedSelectionIds,
  }

  protected selectDate(date: Date): void {
    this.store.selectDate(date)
    this.selectingExercises.set(false)
    this.dirty.set(false)
  }

  protected exerciseName(exerciseId: number): string {
    return this.store.exercises().find(exercise => exercise.id === exerciseId)?.name
      ?? this.store.entries().find(entry => entry.exercise_id === exerciseId)?.training_exercise.name
      ?? 'Ejercicio'
  }

  protected addSet(entryIndex: number): void {
    this.drafts.update(entries => entries.map((entry, index) => index === entryIndex ? {
      ...entry,
      sets: [...entry.sets, this.newSet(entry.sets.length + 1, null, null)],
    } : entry))
    this.dirty.set(true)
  }

  protected removeSet(entryIndex: number, setIndex: number): void {
    this.drafts.update(entries => entries.map((entry, index) => index === entryIndex ? {
      ...entry,
      sets: entry.sets.filter((_, indexToRemove) => indexToRemove !== setIndex)
        .map((set, position) => ({...set, position: position + 1})),
    } : entry))
    this.dirty.set(true)
  }

  protected removeEntry(entryIndex: number): void {
    this.drafts.update(entries => entries.filter((_, index) => index !== entryIndex)
      .map((entry, sortOrder) => ({...entry, sortOrder})))
    this.dirty.set(true)
  }

  protected updateSet(entryIndex: number, setIndex: number, field: 'repetitions' | 'weightKg', event: Event): void {
    const raw = (event.target as HTMLInputElement).value
    const value = raw === '' ? null : Number(raw)
    this.drafts.update(entries => entries.map((entry, index) => index === entryIndex ? {
      ...entry,
      sets: entry.sets.map((set, indexOfSet) => indexOfSet === setIndex ? {...set, [field]: value} : set),
    } : entry))
    this.dirty.set(true)
  }

  protected async save(): Promise<void> {
    await this.store.saveEntries(this.drafts())
    this.dirty.set(false)
  }

  protected readonly formatDateForDisplay = formatDateForDisplay

  private addEntries(exercises: readonly TrainingExerciseListItem[]): void {
    const weekday = getIsoWeekday(this.store.selectedDate())
    this.drafts.update(entries => [
      ...entries,
      ...exercises.map((exercise, offset) => {
        const planned = this.store.schedule().find(item => item.weekday === weekday && item.exercise_id === exercise.id)
        const setCount = planned?.set_count ?? 1
        return {
          clientId: crypto.randomUUID(),
          exerciseId: exercise.id,
          sortOrder: entries.length + offset,
          sets: Array.from({length: setCount}, (_, index) => this.newSet(
            index + 1,
            planned?.target_repetitions ?? null,
            planned?.target_weight_kg ?? null,
          )),
        }
      }),
    ])
    this.selectingExercises.set(false)
    this.dirty.set(true)
  }

  private newSet(position: number, repetitions: number | null, weightKg: number | null): EditableSet {
    return {clientId: crypto.randomUUID(), position, repetitions, weightKg}
  }
}
