import {inject, Injectable} from '@angular/core';
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {IntervalService} from "@core/services/interval.service"
import {OverlayService} from "@core/services/overlay.service"
import {UtilService} from "@core/services/util.service"
import {MathService} from "@core/services/math.service"

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  public interval: IntervalService = inject(IntervalService)
  public math: MathService = inject(MathService)
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



  public inputSelect(event: FocusEvent) {
    (event.target as HTMLInputElement).select();
  }
}
