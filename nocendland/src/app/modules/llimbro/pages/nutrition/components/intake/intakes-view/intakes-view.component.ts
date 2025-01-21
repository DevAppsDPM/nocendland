import { Component, ViewChild } from '@angular/core';
import { CalendarComponent } from "../../../../../../../shared/components/calendar/calendar.component";
import { IntakeListComponent } from "../intake-list/intake-list.component";
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { IntakeService } from '@app/modules/llimbro/services/intake.service';
import { NavigateService } from '@app/shared/services/navigate.service';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-intakes-view',
  standalone: true,
  imports: [
    CalendarComponent,
    IntakeListComponent,
    MatDivider,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './intakes-view.component.html',
  styleUrl: './intakes-view.component.scss'
})
export class IntakesViewComponent {

  @ViewChild(IntakeListComponent) intakeList!: IntakeListComponent

  constructor(protected intakeService: IntakeService, protected navigate: NavigateService) { }

  protected dateSelected(dateSelected: Date): void {
    setTimeout(() => this.intakeList.date = dateSelected)
  }

  protected saveIntake(): void {
    // this.intakeService.saveIntake(this.intakeForm.value)
  }

}
