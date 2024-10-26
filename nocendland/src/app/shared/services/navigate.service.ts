import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NAVIGATE } from '@app/data/constants/NAVIGATE';

export declare type NAVIGATION = 'select-ingredients' | 'intake-view'

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  public navigations: Record<NAVIGATION, any> = {
    'intake-view': NAVIGATE.INTAKE_VIEW,
    'select-ingredients': NAVIGATE.SELECT_INGREDIENTS,
  } 

  constructor(private router: Router) { }

  public to(navigation: NAVIGATION): void {
    const route: string = this.navigations[navigation]
    console.log('Navigating to', route)
    this.router.navigateByUrl(route)
  }
  
}
