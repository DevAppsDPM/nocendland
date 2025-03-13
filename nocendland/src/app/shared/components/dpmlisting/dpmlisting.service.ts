import {effect, Injectable, signal, untracked, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DPMlistingService {

  public items: WritableSignal<Record<string, any>[]> = signal([])
  public filteredItems: WritableSignal<Record<string, any>[]> = signal([])
  public filter: WritableSignal<string> = signal('')

  constructor() {
    this.effectFilter()
    this.effectItems()
  }

  private filterItems(): void {
    // Setear en filteredItems los items filtrados a partir de filter
    const filterValue = this.filter().toLowerCase().trim()

    if (!filterValue) {
      this.filteredItems.set(this.items());
      return
    }

    // TODO: Mejorar el filtro para que tenga en cuenta también las columnas configuradas
    const filtered = this.items().filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(filterValue)
      )
    )

    this.filteredItems.set(filtered)
  }

  private effectItems(): void {
    effect(() => {
      this.items()

      untracked(() => {
        this.filteredItems.set(this.items())
      })
    })
  }

  private effectFilter(): void {
    effect(() => {
      this.filter()
      this.filterItems()
    });
  }
}
