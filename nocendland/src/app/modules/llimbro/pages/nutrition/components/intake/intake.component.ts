import { Component, ViewChild } from '@angular/core';
import {CalendarComponent} from "@shared/components/calendar/calendar.component"
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"
import {MatIconButton} from "@angular/material/button"
import {MatIcon} from "@angular/material/icon"
import {
  IngredientsComponent
} from "@app/modules/llimbro/pages/nutrition/components/ingredient/ingredients/ingredients.component"
import {MatFormField, MatLabel} from "@angular/material/form-field"
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms"
import {NgIf} from "@angular/common"
import {MatInput} from "@angular/material/input"
import { IntakeService } from '@app/modules/llimbro/services/intake.service';
import { IngredientService } from '@app/modules/llimbro/services/ingredient.service';
import {MatSelectModule} from '@angular/material/select';
import { IntakeListComponent } from "./intake-list/intake-list.component";
import { MatDivider } from '@angular/material/divider';
import { NavigateService } from '@app/shared/services/navigate.service';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-intake',
    imports: [
        RouterOutlet,
        CalendarComponent,
        ColumnCenterContainerComponent,
        MatIconButton,
        MatIcon,
        IngredientsComponent,
        MatFormField,
        ReactiveFormsModule,
        NgIf,
        MatInput,
        MatLabel,
        MatSelectModule,
        IntakeListComponent,
        MatDivider,
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
