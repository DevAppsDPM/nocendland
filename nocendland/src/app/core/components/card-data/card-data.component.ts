import {Component, input} from '@angular/core';
import {MatCardModule} from "@angular/material/card"

@Component({
  selector: 'app-card-data',
  imports: [
    MatCardModule
  ],
  templateUrl: './card-data.component.html',
  styleUrl: './card-data.component.scss'
})
export class CardDataComponent {

  public data = input.required<{ name: string, value: any }>()
}
