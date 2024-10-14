import {Component} from '@angular/core';
import {
  IngredientListComponent
} from "@modules/llimbro/pages/nutrition/components/ingredient/ingredient-list/ingredient-list.component";
import {RouterOutlet} from "@angular/router";
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"

@Component({
  selector: 'app-ingredient',
  standalone: true,
  imports: [
    IngredientListComponent,
    RouterOutlet,
    ColumnCenterContainerComponent

  ],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.scss'
})
export class IngredientComponent {

}
