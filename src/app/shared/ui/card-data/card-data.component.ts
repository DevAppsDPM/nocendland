import {Component, input, InputSignal, ChangeDetectionStrategy} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './card-data.component.scss'
})
export class CardDataComponent {

  public data: InputSignal<CARD_DATA> = input.required<CARD_DATA>()
}
