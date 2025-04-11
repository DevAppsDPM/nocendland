import {Component, input, InputSignal} from '@angular/core';
import {MatCardModule} from "@angular/material/card"

export declare type CARD_DATA = {
  name: string
  value: any
}

@Component({
  selector: 'app-card-data',
  imports: [
    MatCardModule
  ],
  templateUrl: './card-data.component.html',
  styleUrl: './card-data.component.scss'
})
export class CardDataComponent {

  public data: InputSignal<CARD_DATA> = input.required<CARD_DATA>()
}
