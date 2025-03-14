import {Component} from '@angular/core';
import {NutritionService} from "@modules/nutrition/services/nutrition.service"

@Component({
  selector: 'app-objectives',
  imports: [],
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.scss'
})
export class ObjectivesComponent {

  constructor(protected nutritionService: NutritionService) {
  }
}
