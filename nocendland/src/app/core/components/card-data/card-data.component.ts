import {Component} from '@angular/core';
import {MatCardModule} from "@angular/material/card"
import {MatProgressSpinner} from "@angular/material/progress-spinner"

@Component({
  selector: 'app-card-data',
  imports: [
    MatCardModule,
    MatProgressSpinner
  ],
  templateUrl: './card-data.component.html',
  styleUrl: './card-data.component.scss'
})
export class CardDataComponent {

}
