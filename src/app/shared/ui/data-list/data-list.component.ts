import {ChangeDetectionStrategy, Component, Signal, computed, input, linkedSignal, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {DEFAULT_IMAGE_PATH} from '@shared/ui/image/image.constants'

export type DataListItemId = string | number

export interface DataListItem<TItem> {
  id: DataListItemId
  value: TItem
  title: string
  details?: readonly string[]
  imageUrl?: string | null
  searchText?: string
}

export interface DataListConfig<TItem> {
  label: string
  actions?: {
    /** Elementos confirmados, siempre expresados como una colección homogénea. */
    confirm?: (items: readonly TItem[]) => void
    /** Solicita al consumidor que vuelva a cargar sus datos. */
    reload?: () => void
  }
  multiple?: Signal<boolean>
  showSelectionConfirmation?: boolean
  confirmationIcon?: string
  loading?: Signal<boolean>
}

@Component({
  selector: 'app-data-list',
  imports: [FormsModule],
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DataListComponent<TItem = unknown> {
  readonly config = input.required<DataListConfig<TItem>>()
  readonly items = input.required<readonly DataListItem<TItem>[]>()

  protected readonly defaultImagePath = DEFAULT_IMAGE_PATH
  protected readonly filter = signal('')
  protected readonly multiple = computed(() => this.config().multiple?.() ?? false)
  protected readonly filteredItems = computed(() => {
    const filter = this.normalizeText(this.filter().trim())
    if (!filter) return this.items()

    return this.items().filter(item => this.normalizeText(
      item.searchText ?? [item.title, ...(item.details ?? [])].join(' '),
    ).includes(filter))
  })
  protected readonly selectedItems = linkedSignal<
    {items: readonly DataListItem<TItem>[]; multiple: boolean},
    readonly DataListItem<TItem>[]
  >({
    source: () => ({items: this.items(), multiple: this.multiple()}),
    computation: ({items, multiple}, previous) => {
      if (!multiple) return []
      const selectedIds = new Set(previous?.value.map(item => item.id) ?? [])
      return items.filter(item => selectedIds.has(item.id))
    },
  })

  protected activate(item: DataListItem<TItem>): void {
    if (this.multiple()) {
      this.toggleSelection(item)
      return
    }

    this.config().actions?.confirm?.([item.value])
  }

  protected clearFilter(): void {
    this.filter.set('')
  }

  protected confirmSelection(): void {
    this.config().actions?.confirm?.(this.selectedItems().map(item => item.value))
    this.selectedItems.set([])
  }

  protected isSelected(item: DataListItem<TItem>): boolean {
    return this.selectedItems().some(selectedItem => selectedItem.id === item.id)
  }

  protected reload(): void {
    this.config().actions?.reload?.()
  }

  private toggleSelection(item: DataListItem<TItem>): void {
    this.selectedItems.update(selected => this.isSelected(item)
      ? selected.filter(selectedItem => selectedItem.id !== item.id)
      : [...selected, item],
    )
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }
}
