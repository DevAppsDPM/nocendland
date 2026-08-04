import { Injectable } from '@angular/core';
import {RESOURCES} from "@data/constants/RESOURCES"

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  public getRandomDefaultImageForIngredient(): string {
    const randomIndex: number = Math.floor(Math.random() * RESOURCES.DEFAULT_INGREDIENTS.length)
    return RESOURCES.DEFAULT_INGREDIENTS[randomIndex]
  }
}
