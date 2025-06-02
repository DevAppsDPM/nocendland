import {inject, Injectable} from '@angular/core';
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {IntervalService} from "@core/services/interval.service"
import {OverlayService} from "@core/services/overlay.service"
import {UtilService} from "@core/services/util.service"

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  public interval: IntervalService = inject(IntervalService)
  public overlay: OverlayService = inject(OverlayService)
  public util: UtilService = inject(UtilService)

  constructor(private logger: LoggerService) {
    this.logger.setConfig(CoreService.name, LOGGER_COLORS.CORE)
  }

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

  public mathGetPercentage(partialValue: number, totalValue: number): number {
    if (totalValue === 0) {
      this.logger.warn("Total value cannot be zero.");
      return 0
    }
    return (partialValue / totalValue) * 100
  }

  public inputSelect(event: FocusEvent) {
    (event.target as HTMLInputElement).select();
  }
}
