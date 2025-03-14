import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor() { }

  public getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  public getDateStringForDB(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }

  public getDateStringForUser(date: Date): string {
    const dayName: string = date.toLocaleDateString('es-ES', { weekday: 'long' });
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

}
