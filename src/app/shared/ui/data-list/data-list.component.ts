import { NgClass } from '@angular/common';
import {
  Component,
  effect,
  Injector, input,
  Input, InputSignal,
  OnInit,
  runInInjectionContext,
  ViewChild,
  WritableSignal,
  ChangeDetectionStrategy
} from '@angular/core';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatListModule, MatListOption, MatSelectionList} from '@angular/material/list';
import {DEFAULT_IMAGE_PATH} from '@shared/ui/image/image.constants';
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field"
import {MatInput} from "@angular/material/input"
import {DataListService} from "@shared/ui/data-list/data-list.service"
import {FormsModule} from "@angular/forms"
import {LOGGER_COLORS, LoggerService} from "@platform/logging/logger.service"
import {getNestedProperty} from "@shared/utilities/object.utils"
import {MatProgressBar} from "@angular/material/progress-bar"
import {MatCard} from "@angular/material/card"

@Component({
  selector: 'app-data-list',
  imports: [
    MatListModule,
    MatIcon,
    MatFabButton,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    MatIconButton,
    MatSuffix,
    NgClass,
    MatProgressBar,
    MatCard
],
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [LoggerService, DataListService]
})
export class DataListComponent implements OnInit {
  public config:InputSignal<DataListConfig> = input.required<DataListConfig>()

  @Input() set items(items: any[]) {
    this.listingService.items.set(items)
  }

  @ViewChild('list') list!: MatSelectionList
  @ViewChild('listMultiSelect') listMultiSelect!: MatSelectionList

  protected readonly defaultImagePath = DEFAULT_IMAGE_PATH;

  protected multiselect: boolean = false

  constructor(
    protected listingService: DataListService,
    private injector: Injector,
    private logger: LoggerService,
  ) {
    this.logger.setConfig(DataListService.name, LOGGER_COLORS.DATA_LIST_COMPONENT)
    this.effectFilteredItems()
  }

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      if (!!this.config().multiSelection) this.setupMultiSelectionEffect()
    })
  }

  protected confirm(items: MatListOption[] | any, index?: number): void {
    if (!this.config().actions?.confirm) {
      this.logger.warn('La función de confirmación no está configurada. [DataListConfig.actions.confirm]')
      return
    }

    this.logger.log('Confirm function', this.config().actions!.confirm!, items)

    if (Array.isArray(items)) this.config().actions!.confirm!(items.map(selected => selected.value))
    else this.config().actions!.confirm!(items, index)
  }

  protected onSelectionChange(event: any): void {
    this.listingService.selectedItems.set(event.source.selectedOptions.selected.map((option: any) => option.value))
  }

  /**
   * Restaura los elementos seleccionados en el multiselect.
   * @private
   */
  private restoreSelectedItems(): void {
    if (this.listMultiSelect) {
      console.log('Restaurando elementos seleccionados en el multiselect')
      // Restaura cada opción del multiselect.
      this.listMultiSelect.options.forEach(option => {
        option.selected = this.listingService.selectedItems().includes(option.value)
      })
    }
  }

  /* EFECTOS */

  private effectFilteredItems(): void {
    effect(() => {
      this.listingService.filteredItems()
      setTimeout(() => this.restoreSelectedItems())
    })
  }

  private setupMultiSelectionEffect(): void {
    effect(() => {
      this.multiselect = this.config().multiSelection!()
      if (!this.multiselect && !!this.listMultiSelect) this.listMultiSelect.deselectAll()
    })
  }

  protected readonly DataListService = DataListService
  protected readonly getNestedProperty = getNestedProperty
}

export declare type DataListConfig = {
  columnConfig: DataListColumnConfig
  actions?: DataListActions
  multiSelection?: WritableSignal<boolean>
  activateConfirm?: boolean
  iconConfirm?: string
  loading?: () => boolean
}

declare type DataListActions = {
  /**
   * Función que se ejecuta al confirmar una selección.
   * @param result
   * @param index
   */
  confirm?: (result: any | any[], index?: number) => void
  /**
   * Función que se ejecuta al pulsar el botón de refresco.
   * Este botón se muestra si se define esta función.
   */
  reload?: () => void
}

declare type DataListColumnConfig = {
  title: string
  lines?: string[]
  image?: string
}
