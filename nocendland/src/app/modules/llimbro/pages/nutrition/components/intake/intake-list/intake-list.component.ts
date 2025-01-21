import { Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RESOURCES } from '@data/constants/RESOURCES';
import { NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT } from '@data/types/llimbro';
import { IntakeService } from '@modules/llimbro/services/intake.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { MatFabButton } from '@angular/material/button';

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
    MatCheckboxModule,
    MatFabButton
  ],
  templateUrl: './intake-list.component.html',
  styleUrl: './intake-list.component.scss'
})
export class IntakeListComponent {
  protected readonly RESOURCES = RESOURCES;

  protected intakesList: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[] = []
  protected intakeIdsSelected: number[] = []

  private _date: Date | undefined

  @Input() set date(date: Date) {
    if (!date) return
    this._date = date
    this.readIntakes()
  }

  constructor(protected intakeService: IntakeService) { }

  private readIntakes(): void {
    this.intakeService.readIntakesByDate(this._date!).then((intakes: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]) => {
      this.intakesList = intakes
    })
  }

  protected deleteIntakes(): void {
    this.intakeService.deleteIntakes(this.intakeIdsSelected).finally(() => {
      this.intakeService.multiselectList.set(false)
      this.readIntakes()
    })
  }

  protected selectUnselectIntake(intake: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT, selected: boolean): void {
    if (selected) this.intakeIdsSelected.push(intake.id)
    else this.intakeIdsSelected.splice(this.intakeIdsSelected.indexOf(intake.id))
    console.log('IntakeIdsSelected', this.intakeIdsSelected)
  }
}
