import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal, WritableSignal } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule, MatListOption } from '@angular/material/list';
import { RESOURCES } from '@app/data/constants/RESOURCES';
import { STRING } from '@app/data/constants/STRING';

@Component({
  selector: 'dpm-listing',
  standalone: true,
  imports: [
    MatListModule,
    NgForOf,
    NgIf,
    MatIcon,
    MatFabButton
  ],
  templateUrl: './dpmlisting.component.html',
  styleUrl: './dpmlisting.component.scss'
})
export class DPMlistingComponent {
  @Input() multiSelection: boolean = false
  @Input() activateConfirm: boolean = true
  @Input() iconConfirm: string = 'done'

  @Input() items: WritableSignal<any> | undefined = undefined

  @Output() itemsEmitter: EventEmitter<any[]> = new EventEmitter<any[]>()
  protected readonly STRING = STRING;
  protected readonly RESOURCES = RESOURCES;

  protected emitItems(itemsSelected: MatListOption[]): void {
    this.itemsEmitter.emit(itemsSelected.map(selected => selected.value))
  }

  protected emitItem(ingredient: any): void {
    this.itemsEmitter.emit([ingredient])
  }
}

export type DPMlistingColumnConfig = {
  title: string
  lines: string[]
  image: any
}