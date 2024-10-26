import {Component} from '@angular/core';
import {
  IngredientsComponent
} from "@app/modules/llimbro/pages/nutrition/components/ingredient/ingredients/ingredients.component";
import {RouterOutlet} from "@angular/router";
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component"

@Component({
  selector: 'app-ingredient',
  standalone: true,
  imports: [
    IngredientsComponent,
    RouterOutlet,
    ColumnCenterContainerComponent

  ],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.scss'
})
export class IngredientComponent {

}
