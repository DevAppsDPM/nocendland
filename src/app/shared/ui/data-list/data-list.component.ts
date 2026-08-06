import {ChangeDetectionStrategy, Component, computed, input, Input, InputSignal, WritableSignal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {DEFAULT_IMAGE_PATH} from '@shared/ui/image/image.constants'
import {DataListService} from '@shared/ui/data-list/data-list.service'
import {LoggerService} from '@platform/logging/logger.service'
import {getNestedProperty} from '@shared/utilities/object.utils'

@Component({
  selector: 'app-data-list',
  imports: [FormsModule],
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [LoggerService, DataListService],
})
export class DataListComponent {
  readonly config: InputSignal<DataListConfig> = input.required<DataListConfig>()
  protected readonly defaultImagePath = DEFAULT_IMAGE_PATH
  protected readonly getNestedProperty = getNestedProperty
  protected readonly multiselect = computed(() => this.config().multiSelection?.() ?? false)

  @Input() set items(items: any[]) {
    this.listingService.setItems(items)
  }

  constructor(
    protected readonly listingService: DataListService,
    private readonly logger: LoggerService,
  ) {}

  protected activate(item: Record<string, any>, index: number): void {
    if (this.multiselect()) {
      this.listingService.toggleSelection(item)
      return
    }

    this.confirm(item, index)
  }

  protected confirm(items: Record<string, any> | Record<string, any>[], index?: number): void {
    const confirmAction = this.config().actions?.confirm
    if (!confirmAction) {
      this.logger.warn('La función de confirmación no está configurada. [DataListConfig.actions.confirm]')
      return
    }

    confirmAction(items, index)
    if (Array.isArray(items)) this.listingService.clearSelection()
  }
}

export type DataListConfig = {
  columnConfig: DataListColumnConfig
  actions?: DataListActions
  multiSelection?: WritableSignal<boolean>
  activateConfirm?: boolean
  iconConfirm?: string
  loading?: () => boolean
}

type DataListActions = {
  /** Función que se ejecuta al confirmar una selección. */
  confirm?: (result: any | any[], index?: number) => void
  /** Función que se ejecuta al pulsar el botón de refresco. */
  reload?: () => void
}

type DataListColumnConfig = {
  title: string
  lines?: string[]
  image?: string
}
