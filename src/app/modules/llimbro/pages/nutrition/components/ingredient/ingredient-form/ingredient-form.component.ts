import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Location, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {STRING} from "@data/constants/STRING";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute} from "@angular/router";
import {IngredientService} from "@modules/llimbro/services/ingredient.service";
import {ConfirmDialogService, DIALOG_CONFIRM} from "@shared/services/confirm-dialog.service"
import {MatDivider} from "@angular/material/divider"
import {NUTRITION_INGREDIENT} from "@data/types/llimbro"
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component";

@Component({
  selector: 'app-ingredient-form',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    NgIf,
    ReactiveFormsModule,
    MatIconButton,
    MatIcon,
    MatDivider,
    MatButton,
    MatFabButton,
    ColumnCenterContainerComponent
  ],
  templateUrl: './ingredient-form.component.html',
  styleUrl: './ingredient-form.component.scss'
})
export class IngredientFormComponent {
  protected readonly FORM_LABELS = STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INGREDIENT.FORM_LABELS

  protected ingredientForm: FormGroup | undefined
  private ingredientId: number = 0
  protected image: string | null = null

  protected new: boolean = false

  @ViewChild('imageInput') imageInput!: ElementRef

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public ingredientService: IngredientService,
    protected location: Location,
    private confirmDialog: ConfirmDialogService,
  ) {
    this.getUrlParam()
    this.buildForm()
    if (!this.new) this.ingredientService.readIngredientById(this.ingredientId).then(ingredient => this.setValues(ingredient.data))
  }

  private getUrlParam(): void {
    const param: string = this.route.snapshot.params['id']
    if (param === 'new') this.new = true
    else this.ingredientId = parseInt(param)
  }

  private buildForm(): void {
    this.ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      calories_per_100: [0],
      proteins_per_100: [0],
      fats_per_100: [0],
      carbohydrates_per_100: [0],
      description: [''],
      ...(!this.new && {id: [this.ingredientId, Validators.required]})
    })
  }

  private setValues(ingredient: NUTRITION_INGREDIENT): void {
    if (!ingredient) return
    // Formulario
    this.setFormValues(ingredient)

    // Imagen
    this.setImage()
  }

  private setFormValues(ingredient: NUTRITION_INGREDIENT): void {
    console.log('Setting form values...', ingredient)
    this.ingredientForm?.patchValue(ingredient)
  }

  private setImage(): void {
    this.ingredientService.readImage(this.ingredientForm?.value).then(data => {
      if (!data.data) return
      this.image = URL.createObjectURL(data.data)
    })
  }

  public saveIngredient(): void {
    this.ingredientService.saveIngredient(this.ingredientForm!.value)
      .then(ingredient => {
        this.new = false
        this.buildForm()
        this.setFormValues(ingredient)
      })
  }

  public deleteIngredient(): void {
    const config: DIALOG_CONFIRM = {
      title: 'Eliminar alimento',
      message: `Se va a eliminar el alimento ${this.ingredientForm?.value['name']}`,
      acceptButton: { text: 'Eliminar', show: false , color: 'warn' },
    }

    this.confirmDialog.open(config).subscribe((deleted: boolean) => {
      if (deleted) this.ingredientService.deleteIngredient(this.ingredientForm?.value).then(() => this.location.back())
    })
  }

  public selectImage(): void {
    this.imageInput.nativeElement.click()
  }

  public onFileSelected(event: any): void {
    console.log('File selected', event)
    const file: File = event.target.files[0]

    if (!file) return

    this.ingredientService.uploadImage(this.ingredientForm?.value, file)
      ?.then(() => this.setImage())
  }

  protected readonly STRING = STRING
}
