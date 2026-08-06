import {computed, Injectable, signal} from '@angular/core'

@Injectable()
export class DataListService {
  private readonly itemsState = signal<Record<string, any>[]>([])
  private readonly selectedItemsState = signal<Record<string, any>[]>([])
  private readonly filterState = signal('')

  readonly filter = this.filterState.asReadonly()
  readonly selectedItems = this.selectedItemsState.asReadonly()
  readonly filteredItems = computed(() => {
    const filterValue = this.normalizeText(this.filterState().trim())
    if (!filterValue) return this.itemsState()

    return this.itemsState().filter(item =>
      Object.values(item).some(value => this.normalizeText(String(value)).includes(filterValue)),
    )
  })

  setItems(items: Record<string, any>[]): void {
    this.itemsState.set(items)
    this.selectedItemsState.update(selected => selected.filter(item => items.includes(item)))
  }

  setFilter(filter: string): void {
    this.filterState.set(filter)
  }

  clearFilter(): void {
    this.filterState.set('')
  }

  clearSelection(): void {
    this.selectedItemsState.set([])
  }

  isSelected(item: Record<string, any>): boolean {
    return this.selectedItemsState().includes(item)
  }

  toggleSelection(item: Record<string, any>): void {
    this.selectedItemsState.update(selected =>
      selected.includes(item) ? selected.filter(selectedItem => selectedItem !== item) : [...selected, item],
    )
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }
}
