import {afterNextRender, Component, ElementRef, Signal, viewChild, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NUTRITION_TEXT} from "@areas/llimbro/nutrition/nutrition.constants";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute} from "@angular/router";
import {ConfirmDialogService, DIALOG_CONFIRM} from "@shared/ui/services/confirm-dialog.service"
import {MatDivider} from "@angular/material/divider"
import {NutritionIngredient, NutritionIngredientImage} from "@areas/llimbro/nutrition/models/nutrition.models"
import {NutritionStore} from "@areas/llimbro/nutrition/state/nutrition.store"
import {NavigationService} from "@shell/navigation/navigation.service"
import {AvatarComponent} from "@shared/ui/avatar/avatar.component"
import {BaseChartDirective} from "ng2-charts"
import {Chart, ChartConfiguration, ChartData} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels"
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup} from "@angular/material/card"
import {NutritionResourcesService} from "@areas/llimbro/nutrition/services/nutrition-resources.service"

@Component({
    selector: 'app-ingredient-form',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatIconButton,
    MatIcon,
    MatDivider,
    MatButton,
    AvatarComponent,
    BaseChartDirective,
    MatCard,
    MatCardTitleGroup,
    MatCardTitle,
    MatCardContent,
    MatCardHeader
],
    templateUrl: './ingredient-form.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './ingredient-form.component.scss'
})
export class IngredientFormComponent {
  protected readonly formLabels = NUTRITION_TEXT.ingredients.formLabels

  protected ingredientForm: FormGroup | undefined
  private ingredientId: number = 0
  protected image: string | null = null
  protected defaultImage: string = ''

  protected new: boolean = false
  protected editing: boolean = false

  @ViewChild('imageInput') imageInput!: ElementRef
  @ViewChild('name') nameField!: ElementRef

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    protected nutritionStore: NutritionStore,
    private resources: NutritionResourcesService,
    protected navigation: NavigationService,
  ) {
    Chart.register(ChartDataLabels)
    this.getUrlParam()
    this.buildForm()
    if (!this.new) this.nutritionStore.readIngredient(this.ingredientId).then(ingredient => this.setValues(ingredient))
    afterNextRender(() => {
      if (this.new) document.getElementById('name')?.focus()
    })
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
      grams_per_unit: [0],
      image_route: [this.resources.getRandomDefaultIngredientStoragePath()],
      ...(!this.new && {id: [this.ingredientId, Validators.required]})
    })
  }

  private setValues(ingredient: NutritionIngredient): void {
    if (!ingredient) return
    // Formulario
    this.setFormValues(ingredient)

    // Gráfico
    this.updateChartData()

    // Imagen
    this.setImage()
  }

  private setFormValues(ingredient: NutritionIngredient): void {
    console.log('Setting form values...', ingredient)
    this.ingredientForm?.patchValue(ingredient)
  }

  private setImage(): void {
    // Obtener la imagen del ingrediente si existe.
    const ingredientImage = this.nutritionStore.ingredientImageList().find((image: NutritionIngredientImage) => image.ingredientId === this.ingredientId)
    if (!!ingredientImage) {
      this.image = ingredientImage.src ? URL.createObjectURL(ingredientImage.src) : null
    } else {
      // Si no hay imagen, se asigna una imagen por defecto aleatoria de default-ingredients.
      if (!this.image) {
        console.log('Imagen no encontrada, asignando imagen por defecto')
        this.defaultImage = this.resources.getRandomDefaultImageForIngredient()
        console.log(this.defaultImage)
      }
    }
  }

  public saveIngredient(): void {
    this.nutritionStore.saveIngredient(this.ingredientForm!.value)
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
      if (deleted) this.nutritionStore.deleteIngredients([this.ingredientForm?.value])
        .then(() => this.navigation.to('nutrition', 'ingredients'))
    })
  }

  public selectImage(): void {
    this.imageInput.nativeElement.click()
  }

  public async onFileSelected(event: Event): Promise<void> {
    console.log('File selected', event)
    const file = (event.target as HTMLInputElement).files?.[0]

    if (!file) return

    await this.nutritionStore.saveIngredientImage(this.ingredientForm?.value, file)
    this.setImage()
  }


  protected goBack(): void {
    // Si es un nuevo ingrediente o no se está editando, se navega a la lista de ingredientes.
    if (this.new || (!this.new && !this.editing)) {
      this.navigation.to('nutrition', 'ingredients')
    }

    // Si se está editando, se cancela la edición.
    if (this.editing) this.editing = false
  }






  private nutriendValuesEmojiList: string[] = ['⚡', '🍗', '🥑', '🍚']
  public chart: Signal<BaseChartDirective> = viewChild.required<BaseChartDirective>(BaseChartDirective)
  public chartData: ChartData<'doughnut'> = {
    labels: ['⚡ Calorías', '🍗 Proteínas', '🥑 Grasas', ' 🍚Hidratos'],
    datasets: [
      { data: [0, 0, 0, 0] }
    ],
  }
  protected chartType: ChartConfiguration<'doughnut'>['type'] = 'doughnut'
  protected chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    cutout: '60%',
    circumference: 180,
    plugins: {
      legend: { display: false }, // Oculta la leyenda
      datalabels: {
        formatter: (value, context) => {
          const label = this.nutriendValuesEmojiList[context.dataIndex] || ''
          return `${label} ${value} g`;
        },
        font: {
          size: 12,
          weight: 'bold',
        },
        color: '#000'
      }
    }

  }

  private updateChartData(): void {
    if (!this.ingredientForm) return;

    this.chartData.datasets = [
      {
        data: [
          this.ingredientForm.value.calories_per_100 || 0,
          this.ingredientForm.value.proteins_per_100 || 0,
          this.ingredientForm.value.fats_per_100 || 0,
          this.ingredientForm.value.carbohydrates_per_100 || 0
        ],
        borderWidth: 0,
        backgroundColor: ['#A5243D', '#90E39A', '#DDF093', '#46B1C9'],
        rotation: 270
      },
    ]

    this.chart().update()
  }

  protected readonly text = NUTRITION_TEXT
  protected readonly ChartDataLabels = ChartDataLabels
}
