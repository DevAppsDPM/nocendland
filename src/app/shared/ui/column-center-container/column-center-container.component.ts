import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { NgTemplateOutlet } from "@angular/common";

/**
 * Este componente recibe un otro componente y lo inyecta en su html rodeándolo de su marco. El marco es una columna
 * centrada con bordes a los lados (Estilo twitter)
 */
@Component({
    selector: 'app-column-center-container',
    imports: [
    NgTemplateOutlet
],
    templateUrl: './column-center-container.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './column-center-container.component.scss'
})
export class ColumnCenterContainerComponent {
  @Input() template!: any
}
