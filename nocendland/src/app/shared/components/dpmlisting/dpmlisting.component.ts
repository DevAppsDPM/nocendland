import {NgForOf, NgIf} from '@angular/common';
import {
  Component,
  effect,
  Injector,
  Input,
  OnInit,
  runInInjectionContext,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatListModule, MatListOption, MatSelectionList} from '@angular/material/list';
import {RESOURCES} from '@app/data/constants/RESOURCES';
import {STRING} from '@app/data/constants/STRING';
import {MatFormField, MatLabel} from "@angular/material/form-field"
import {MatInput} from "@angular/material/input"
import {DPMlistingService} from "@shared/components/dpmlisting/dpmlisting.service"
import {FormsModule} from "@angular/forms"
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {CoreService} from "@core/services/core.service"

@Component({
  selector: 'dpm-listing',
  imports: [
    MatListModule,
    NgForOf,
    NgIf,
    MatIcon,
    MatFabButton,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
  ],
  templateUrl: './dpmlisting.component.html',
  styleUrl: './dpmlisting.component.scss',
  providers: [LoggerService, DPMlistingService]
})
export class DPMlistingComponent implements OnInit {
  @Input({required: true}) config!: DPMlistingConfig

  @Input() set items(items: any[]) {
    this.listingService.items.set(items)
  }

  @ViewChild('list') list!: MatSelectionList
  @ViewChild('listMultiSelect') listMultiSelect!: MatSelectionList

  protected readonly STRING = STRING;
  protected readonly RESOURCES = RESOURCES;

  protected multiselect: boolean = false

  constructor(
    protected listingService: DPMlistingService,
    private injector: Injector,
    private logger: LoggerService,
    protected core: CoreService,
  ) {
    this.logger.setConfig(DPMlistingService.name, LOGGER_COLORS.DPM_COMPONENT)
  }

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      if (!!this.config.multiSelection) this.effectMultiselecction()
    })
  }

  protected confirm(items: MatListOption[] | any, index?: number): void {
    if (!this.config.actions?.confirm) {
      this.logger.warn('La función de confirmación no está configurada. [DPMlistingConfig.actions.confirm]')
      return
    }

    this.logger.log('Confirm function', this.config.actions.confirm, items)

    if (Array.isArray(items)) this.config.actions.confirm(items.map(selected => selected.value))
    else this.config.actions.confirm(items, index)
  }

  /* EFFECTS */
  private effectMultiselecction(): void {
    effect(() => {
      this.multiselect = this.config.multiSelection!()
      if (!this.multiselect && !!this.listMultiSelect) this.listMultiSelect.deselectAll()
    })
  }
}

export declare type DPMlistingConfig = {
  columnConfig: DPMlistingDataConfig
  actions?: DPMlistingActions
  multiSelection?: WritableSignal<boolean>
  activateConfirm?: boolean
  iconConfirm?: string
}

declare type DPMlistingActions = {
  confirm?: (result: any | any[], index?: number) => void
}

declare type DPMlistingImage = {
  src: any
  alt: string
}

declare type DPMlistingDataConfig = {
  title: string
  lines?: string[]
  image?: DPMlistingImage
}
