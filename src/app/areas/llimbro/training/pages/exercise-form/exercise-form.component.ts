import {ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild} from '@angular/core'
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {NavigationService} from '@shell/navigation/navigation.service'
import {AvatarComponent} from '@shared/ui/avatar'
import {ConfirmDialogService, DialogConfirm} from '@shared/ui/confirm-dialog'
import {TrainingExerciseDraft} from '../../models/training.models'
import {TrainingStore} from '../../state/training.store'

type ExerciseForm = FormGroup<{
  name: FormControl<string>
  description: FormControl<string>
  tips: FormArray<FormControl<string>>
}>

@Component({
  selector: 'app-exercise-form',
  imports: [ReactiveFormsModule, AvatarComponent],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ExerciseFormComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly navigation = inject(NavigationService)
  private readonly confirmDialog = inject(ConfirmDialogService)
  protected readonly store = inject(TrainingStore)
  protected readonly isNew = signal(this.route.snapshot.params['id'] === 'new')
  protected readonly imageUrl = signal<string | null>(null)
  protected readonly error = signal<string | null>(null)
  protected readonly form: ExerciseForm = new FormGroup({
    name: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    description: new FormControl('', {nonNullable: true}),
    tips: new FormArray<FormControl<string>>([]),
  })
  private exerciseId: number | undefined
  private selectedImage: File | undefined

  @ViewChild('imageInput') private imageInput?: ElementRef<HTMLInputElement>

  constructor() {
    if (!this.isNew()) void this.loadExercise(Number(this.route.snapshot.params['id']))
  }

  protected get tips(): FormArray<FormControl<string>> {
    return this.form.controls.tips
  }

  protected addTip(value = ''): void {
    this.tips.push(new FormControl(value, {nonNullable: true}))
  }

  protected removeTip(index: number): void {
    this.tips.removeAt(index)
  }

  protected chooseImage(): void {
    this.imageInput?.nativeElement.click()
  }

  protected onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    this.selectedImage = file
    this.imageUrl.set(URL.createObjectURL(file))
  }

  protected async save(): Promise<void> {
    this.form.markAllAsTouched()
    if (this.form.invalid) return
    this.error.set(null)
    const draft: TrainingExerciseDraft = {
      id: this.exerciseId,
      name: this.form.controls.name.value,
      description: this.form.controls.description.value || null,
      tips: this.tips.getRawValue(),
      image_path: this.exerciseId ? this.store.exercises().find(item => item.id === this.exerciseId)?.image_path ?? null : null,
    }
    try {
      const saved = await this.store.saveExercise(draft)
      this.exerciseId = saved.id
      if (this.selectedImage) await this.store.uploadExerciseImage(saved.id, this.selectedImage)
      this.isNew.set(false)
      await this.navigation.to('training', 'exercise-form', String(saved.id))
    } catch {
      this.error.set('No se ha podido guardar el ejercicio. Revisa el nombre e inténtalo de nuevo.')
    }
  }

  protected archive(): void {
    if (!this.exerciseId) return
    const config: DialogConfirm = {
      title: 'Archivar ejercicio',
      message: `Se ocultará ${this.form.controls.name.value} y se retirará del horario. Su historial se conservará.`,
      acceptButton: {text: 'Archivar', show: true, intent: 'danger'},
    }
    this.confirmDialog.open(config).subscribe(confirmed => {
      if (!confirmed || !this.exerciseId) return
      void this.store.archiveExercise(this.exerciseId)
        .then(() => this.navigation.to('training', 'exercises'))
    })
  }

  protected goBack(): void {
    void this.navigation.to('training', 'exercises')
  }

  private async loadExercise(id: number): Promise<void> {
    if (!Number.isInteger(id)) {
      this.goBack()
      return
    }
    try {
      const exercise = await this.store.readExercise(id)
      this.exerciseId = exercise.id
      this.form.controls.name.setValue(exercise.name)
      this.form.controls.description.setValue(exercise.description ?? '')
      exercise.tips.forEach(tip => this.addTip(tip))
      await this.store.loadExercises()
      this.imageUrl.set(this.store.exercises().find(item => item.id === id)?.imageUrl ?? null)
    } catch {
      this.error.set('No se ha podido cargar el ejercicio.')
    }
  }
}

