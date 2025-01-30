import {Component} from '@angular/core';
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms"
import {IntakeService} from '@app/modules/llimbro/services/intake.service';
import {IngredientService} from '@app/modules/llimbro/services/ingredient.service';
import {MatSelectModule} from '@angular/material/select';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-intake',
  imports: [
    RouterOutlet,
    ColumnCenterContainerComponent,
    ReactiveFormsModule,
    MatSelectModule,

  ],
    templateUrl: './intake.component.html',
    styleUrl: './intake.component.scss'
})
export class IntakeComponent {
  public intakeForm!: FormGroup;


  constructor(private formBuilder: FormBuilder, private intakeService: IntakeService, protected ingredientService: IngredientService) {
    this.buildForm()
  }

  private buildForm(): void {
    this.intakeForm = this.formBuilder.group({
      id: [],
      date: [],
      ingredient: [],
      quantity_in_grams: [0],
    })
  }

  protected selectIngredient(): void {

  }



}
