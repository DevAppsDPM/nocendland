import {ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {DataListComponent, DataListConfig, DataListItem} from '@shared/ui/data-list'
import {ConfirmDialogService} from '@shared/ui/confirm-dialog'
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
  private readonly confirmDialog = inject(ConfirmDialogService)
  protected readonly weekdays = TRAINING_WEEKDAYS
  protected readonly selectedWeekday = signal(getIsoWeekday(new Date()))
  protected readonly selectingExercises = signal(false)
  protected readonly dirty = signal(false)
  protected readonly saveError = signal<string | null>(null)
  protected readonly catalogAction = signal<'create' | 'rename' | 'duplicate' | null>(null)
  protected readonly scheduleName = signal('')
  protected readonly catalogError = signal<string | null>(null)
  protected readonly shareUrl = signal<string | null>(null)
  protected readonly managingShares = signal(false)
  private readonly multiSelection = signal(true)
  protected readonly drafts = linkedSignal<TrainingScheduleDraft[]>(() => this.store.selectedScheduleItems()
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

  protected selectSchedule(event: Event): void {
    if (this.dirty()) {
      this.catalogError.set('Guarda o descarta los cambios del día antes de cambiar de horario.')
      ;(event.target as HTMLSelectElement).value = String(this.store.selectedScheduleId() ?? '')
      return
    }
    this.store.selectSchedule(Number((event.target as HTMLSelectElement).value))
    this.selectingExercises.set(false)
    this.saveError.set(null)
    this.catalogError.set(null)
  }

  protected beginCatalogAction(action: 'create' | 'rename' | 'duplicate'): void {
    this.catalogAction.set(action)
    const selectedName = this.store.selectedSchedule()?.name ?? 'Horario'
    this.scheduleName.set(action === 'create' ? this.nextScheduleName('Horario')
      : action === 'duplicate' ? this.nextScheduleName(`${selectedName} copia`)
        : selectedName)
    this.catalogError.set(null)
  }

  protected updateScheduleName(event: Event): void {
    this.scheduleName.set((event.target as HTMLInputElement).value)
  }

  protected async saveCatalogAction(): Promise<void> {
    const action = this.catalogAction()
    const name = this.scheduleName().trim()
    if (!action || !name) {
      this.catalogError.set('El horario necesita un nombre.')
      return
    }
    this.catalogError.set(null)
    try {
      if (action === 'create') await this.store.createSchedule(name)
      if (action === 'rename') await this.store.renameSelectedSchedule(name)
      if (action === 'duplicate') await this.store.duplicateSelectedSchedule(name)
      this.catalogAction.set(null)
    } catch {
      this.catalogError.set('No se ha podido guardar el horario. Comprueba que el nombre no esté repetido.')
    }
  }

  protected async activateSchedule(): Promise<void> {
    try {
      await this.store.activateSelectedSchedule()
    } catch {
      this.catalogError.set('No se ha podido activar el horario.')
    }
  }

  protected deleteSchedule(): void {
    const schedule = this.store.selectedSchedule()
    if (!schedule) return
    if (schedule.is_active) {
      this.catalogError.set('Activa otro horario antes de eliminar este.')
      return
    }
    this.confirmDialog.open({
      title: 'Eliminar horario',
      message: `Se eliminará ${schedule.name}. Los seguimientos guardados no cambiarán.`,
      acceptButton: {text: 'Eliminar', show: true, intent: 'danger'},
    }).subscribe(confirmed => {
      if (!confirmed) return
      void this.store.deleteSelectedSchedule().catch(() =>
        this.catalogError.set('No se ha podido eliminar el horario.'))
    })
  }

  protected async shareSchedule(): Promise<void> {
    this.catalogError.set(null)
    try {
      const share = await this.store.shareSelectedSchedule()
      const url = new URL(`/share/training/${share.token}`, globalThis.location.origin).toString()
      this.shareUrl.set(url)
      await this.copyShareUrl(url)
    } catch {
      this.catalogError.set('No se ha podido crear el enlace compartido.')
    }
  }

  protected async copyShareUrl(url = this.shareUrl()): Promise<void> {
    if (!url) return
    try {
      await globalThis.navigator.clipboard.writeText(url)
    } catch {
      this.catalogError.set('Copia el enlace manualmente desde el campo.')
    }
  }

  protected revokeShare(shareId: string): void {
    this.confirmDialog.open({
      title: 'Revocar enlace',
      message: 'El enlace dejará de funcionar. Las copias ya importadas no se modificarán.',
      acceptButton: {text: 'Revocar', show: true, intent: 'danger'},
    }).subscribe(confirmed => {
      if (confirmed) void this.store.revokeShare(shareId)
    })
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

  private nextScheduleName(base: string): string {
    const names = new Set(this.store.schedules().map(schedule => schedule.name.toLocaleLowerCase()))
    if (!names.has(base.toLocaleLowerCase())) return base
    let suffix = 2
    while (names.has(`${base} ${suffix}`.toLocaleLowerCase())) suffix += 1
    return `${base} ${suffix}`
  }
}
