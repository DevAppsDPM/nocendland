import {effect, Injectable, signal, untracked, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DPMlistingService {

  public items: WritableSignal<Record<string, any>[]> = signal([])
  public filteredItems: WritableSignal<Record<string, any>[]> = signal([])
  public selectedItems: WritableSignal<Record<string, any>[]> = signal([])
  public filter: WritableSignal<string> = signal('')

  constructor() {
    this.effectFilter()
    this.effectItems()
  }

  public clearFilter(): void {
    this.filter.set('')
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private filterItems(): void {
    const filterValue = this.normalizeText(this.filter().trim());

    if (!filterValue) {
      this.filteredItems.set(this.items());
      return;
    }

    const filtered = this.items().filter(item =>
      Object.values(item).some(value =>
        this.normalizeText(String(value)).includes(filterValue)
      )
    );

    this.filteredItems.set(filtered);
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
