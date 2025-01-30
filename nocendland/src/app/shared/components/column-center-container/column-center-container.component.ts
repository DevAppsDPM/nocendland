import {Component, Input} from '@angular/core';
import {NgIf, NgTemplateOutlet} from "@angular/common"

/**
 * Este componente recibe un otro componente y lo inyecta en su html rodeándolo de su marco. El marco es una columna
 * centrada con bordes a los lados (Estilo twitter)
 */
@Component({
    selector: 'app-column-center-container',
    imports: [
        NgTemplateOutlet,
        NgIf
    ],
    templateUrl: './column-center-container.component.html',
    styleUrl: './column-center-container.component.scss'
})
export class ColumnCenterContainerComponent {
  @Input() template!: any
  
}
