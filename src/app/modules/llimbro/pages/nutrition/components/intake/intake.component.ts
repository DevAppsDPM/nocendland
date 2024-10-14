import { Component } from '@angular/core';
import {CalendarComponent} from "@shared/components/calendar/calendar.component"
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"
import {MatIconButton} from "@angular/material/button"
import {MatIcon} from "@angular/material/icon"
import {
  IngredientListComponent
} from "@modules/llimbro/pages/nutrition/components/ingredient/ingredient-list/ingredient-list.component"
import {MatFormField, MatLabel} from "@angular/material/form-field"
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms"
import {NgIf} from "@angular/common"
import {MatInput} from "@angular/material/input"

@Component({
  selector: 'app-intake',
  standalone: true,
  imports: [
    CalendarComponent,
    ColumnCenterContainerComponent,
    MatIconButton,
    MatIcon,
    IngredientListComponent,
    MatFormField,
    ReactiveFormsModule,
    NgIf,
    MatInput,
    MatLabel
  ],
  templateUrl: './intake.component.html',
  styleUrl: './intake.component.scss'
})
export class IntakeComponent {
  public intakeForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
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
}
