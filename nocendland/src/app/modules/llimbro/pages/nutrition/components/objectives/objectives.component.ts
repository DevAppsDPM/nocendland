import { Component } from '@angular/core';
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"

@Component({
  selector: 'app-objectives',
  standalone: true,
  imports: [
    ColumnCenterContainerComponent
  ],
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.scss'
})
export class ObjectivesComponent {

}
