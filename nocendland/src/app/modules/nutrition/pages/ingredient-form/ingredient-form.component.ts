import {AfterViewInit, Component, ElementRef, Signal, viewChild, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {STRING} from "@data/constants/STRING";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute} from "@angular/router";
import {IngredientService} from "@modules/nutrition/services/ingredient.service";
import {ConfirmDialogService, DIALOG_CONFIRM} from "@shared/services/confirm-dialog.service"
import {MatDivider} from "@angular/material/divider"
import {NUTRITION_INGREDIENT} from "@data/types/llimbro"
import {RESOURCES} from '@data/constants/RESOURCES';
import {NutritionService} from "@modules/nutrition/services/nutrition.service"
import {DeviceService} from "@core/services/device.service"
import {ApiNutritionIngredientService} from "@api/services/api-nutrition-ingredient.service"
import {NavigateService} from "@core/services/navigate.service"
import {AvatarComponent} from "@core/components/avatar/avatar.component"
import {BaseChartDirective} from "ng2-charts"
import {Chart, ChartConfiguration, ChartData} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels"
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup} from "@angular/material/card"

@Component({
    selector: 'app-ingredient-form',
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
    AvatarComponent,
    BaseChartDirective,
    MatCard,
    MatCardTitleGroup,
    MatCardTitle,
    MatCardContent,
    MatCardHeader
  ],
    templateUrl: './ingredient-form.component.html',
    styleUrl: './ingredient-form.component.scss'
})
export class IngredientFormComponent implements AfterViewInit {
  protected readonly FORM_LABELS = STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INGREDIENT.FORM_LABELS
  protected readonly RESOURCES = RESOURCES

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
    private nutritionService: NutritionService,
    protected device: DeviceService,
    protected apiNutritionIngredientService: ApiNutritionIngredientService,
    protected navigate: NavigateService,
    public ingredientService: IngredientService,
  ) {
    Chart.register(ChartDataLabels)
    this.getUrlParam()
    this.buildForm()
    if (!this.new) this.apiNutritionIngredientService.readIngredientById(this.ingredientId).then(ingredient => this.setValues(ingredient))
  }

  ngAfterViewInit(): void {
    if (this.new) document.getElementById('name')?.focus()
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
      ...(!this.new && {id: [this.ingredientId, Validators.required]})
    })
  }

  private setValues(ingredient: NUTRITION_INGREDIENT): void {
    if (!ingredient) return
    // Formulario
    this.setFormValues(ingredient)

    // Gráfico
    this.updateChartData()

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
      .then(() => {
        // Si no hay imagen, se asigna una imagen por defecto aleatoria de default-ingredients.
        if (!this.image) {
          console.log('Imagen no encontrada, asignando imagen por defecto')
          const randomIndex: number = Math.floor(Math.random() * RESOURCES.DEFAULT_INGREDIENTS.length)
          this.defaultImage = RESOURCES.DEFAULT_INGREDIENTS[randomIndex]
          console.log(this.defaultImage)
        }
      })
  }

  public saveIngredient(): void {
    this.apiNutritionIngredientService.saveIngredient(this.ingredientForm!.value)
      .then(ingredient => {
        this.new = false
        this.buildForm()
        this.setFormValues(ingredient)
      })
      .then(() => this.nutritionService.loadIngredientList())
  }

  public deleteIngredient(): void {
    const config: DIALOG_CONFIRM = {
      title: 'Eliminar alimento',
      message: `Se va a eliminar el alimento ${this.ingredientForm?.value['name']}`,
      acceptButton: { text: 'Eliminar', show: false , color: 'warn' },
    }

    this.confirmDialog.open(config).subscribe((deleted: boolean) => {
      if (deleted) this.apiNutritionIngredientService.deleteIngredients([this.ingredientForm?.value])
        .then(() => this.nutritionService.loadIngredientList())
        .then(() => this.navigate.to('nutrition', 'ingredients'))
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

  protected goBack(): void {
    // Si es un nuevo ingrediente o no se está editando, se navega a la lista de ingredientes.
    if (this.new || (!this.new && !this.editing)) {
      this.navigate.to('nutrition', 'ingredients')
    }

    // Si se está editando, se cancela la edición.
    if (this.editing) this.editing = false
  }






  private nutriendValuesEmojiList: string[] = ['🍗', '🥑', '🍚']
  public chart: Signal<BaseChartDirective> = viewChild.required<BaseChartDirective>(BaseChartDirective)
  public chartData: ChartData<'doughnut'> = {
    labels: ['🍗 Proteínas', '🥑 Grasas', ' 🍚Hidratos'],
    datasets: [
      { data: [0, 0, 0] }
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
        }
      }
    }

  }

  private updateChartData(): void {
    if (!this.ingredientForm) return;

    this.chartData.datasets = [
      {
        data: [
          this.ingredientForm.value.proteins_per_100 || 0,
          this.ingredientForm.value.fats_per_100 || 0,
          this.ingredientForm.value.carbohydrates_per_100 || 0
        ],
        borderWidth: 0,
        backgroundColor: ['#90E39A', '#DDF093', '#46B1C9'],
        rotation: 270
      },
    ]

    this.chart().update()
  }

  protected readonly STRING = STRING
  protected readonly ChartDataLabels = ChartDataLabels
}
