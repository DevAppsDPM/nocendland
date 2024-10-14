import {Component, OnInit} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {ROUTES} from "@data/constants/ROUTES";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {STRING} from "@data/constants/STRING";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NutritionService} from "@modules/llimbro/services/nutrition.service"
import {FileObject} from "@supabase/storage-js"
import {
  ColumnCenterContainerComponent
} from "@shared/components/column-center-container/column-center-container.component";

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [
    MatListModule,
    NgIf,
    NgForOf,
    MatIcon,
    MatIconButton,
    MatProgressBar,
    ColumnCenterContainerComponent
  ],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.scss'
})
export class IngredientListComponent implements OnInit {
  constructor(public nutritionService: NutritionService, private router: Router) {
  }

  ngOnInit(): void {
    this.nutritionService.ingredient.readIngredients()
    this.readImages()
  }

  protected navigateToIngredientForm(ingredientId: number | 'new'): void {
    this.router.navigateByUrl(this.nutritionService.routeBase() + ROUTES.MODULES.LLIMBRO.INGREDIENT_FORM + '/' + ingredientId)
  }

  protected readImages(): void {
    console.log('Reading all images... ')
    this.nutritionService.ingredient.readImages()
  }

  public getIma(t: string): string {
    return t
  }
  protected readonly STRING = STRING;
}
