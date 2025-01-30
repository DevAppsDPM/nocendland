import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"

@Component({
    selector: 'app-ingredient',
  imports: [
    RouterOutlet,
    ColumnCenterContainerComponent
  ],
    templateUrl: './ingredient.component.html',
    styleUrl: './ingredient.component.scss'
})
export class IngredientComponent {

}
