import { Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RESOURCES } from '@app/data/constants/RESOURCES';
import { NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT } from '@app/data/types/llimbro';
import { IntakeService } from '@app/modules/llimbro/services/intake.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-intake-list',
  standalone: true,
  imports: [
    NgIf,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatDivider,
    MatCheckboxModule
  ],
  templateUrl: './intake-list.component.html',
  styleUrl: './intake-list.component.scss'
})
export class IntakeListComponent {
  protected readonly RESOURCES = RESOURCES;

  @Input() multiselect: boolean = false

  protected intakesList: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[] = []

  @Input() set date(date: Date) {
    this.readIntakes(date)
  }

  constructor(private intakeService: IntakeService) { }

  private readIntakes(date: Date): void {
    this.intakeService.readIntakesByDate(date).then((intakes: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]) => {
      this.intakesList = intakes
    })
  }

}
