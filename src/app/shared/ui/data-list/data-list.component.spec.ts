import {signal} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataListComponent } from './data-list.component';

describe('DataListComponent', () => {
  let component: DataListComponent;
  let fixture: ComponentFixture<DataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', {label: 'Elementos'});
    fixture.componentRef.setInput('items', [{id: 1, value: {id: 1}, title: 'Elemento'}]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the typed presentation item', () => {
    expect(fixture.nativeElement.textContent).toContain('Elemento');
  });

  it('preselects the configured identities in multiple mode', () => {
    fixture.componentRef.setInput('config', {
      label: 'Elementos',
      multiple: signal(true),
      initialSelectedIds: signal([2]),
    })
    fixture.componentRef.setInput('items', [
      {id: 1, value: {id: 1}, title: 'Primero'},
      {id: 2, value: {id: 2}, title: 'Planificado'},
    ])
    fixture.detectChanges()
    const selected: HTMLElement = fixture.nativeElement.querySelector('.data-list__item--selected')
    expect(selected.textContent).toContain('Planificado')
  })

  it('keeps the tools and confirmation visible while only the items overflow', () => {
    fixture.componentRef.setInput('config', {
      label: 'Elementos',
      multiple: signal(true),
      showSelectionConfirmation: true,
    })
    fixture.componentRef.setInput('items', Array.from({length: 30}, (_, index) => ({
      id: index,
      value: {id: index},
      title: `Elemento ${index + 1}`,
    })))
    fixture.nativeElement.style.height = '20rem'
    fixture.detectChanges()

    const root: HTMLElement = fixture.nativeElement.querySelector('.data-list')
    const tools: HTMLElement = fixture.nativeElement.querySelector('.data-list__tools')
    const content: HTMLElement = fixture.nativeElement.querySelector('.data-list__content')
    const footer: HTMLElement = fixture.nativeElement.querySelector('.data-list__footer')
    const rootRect = root.getBoundingClientRect()

    expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
    expect(getComputedStyle(content).overflowY).toBe('auto')
    expect(tools.getBoundingClientRect().top).toBeGreaterThanOrEqual(rootRect.top)
    expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(rootRect.bottom)
  })

  it('filters items and renders the empty state', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.data-list__search-input')
    input.value = 'No existe'
    input.dispatchEvent(new Event('input'))
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelectorAll('.data-list__item').length).toBe(0)
    expect(fixture.nativeElement.textContent).toContain('No hay elementos')
  })

  it('requests a reload from the toolbar', () => {
    const reload = jasmine.createSpy('reload')
    fixture.componentRef.setInput('config', {label: 'Elementos', actions: {reload}})
    fixture.detectChanges()

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Actualizar lista"]')
    button.click()

    expect(reload).toHaveBeenCalledOnceWith()
  })

  it('confirms the selected domain values', () => {
    const confirm = jasmine.createSpy('confirm')
    fixture.componentRef.setInput('config', {
      label: 'Elementos',
      actions: {confirm},
      multiple: signal(true),
      showSelectionConfirmation: true,
    })
    fixture.detectChanges()

    const item: HTMLButtonElement = fixture.nativeElement.querySelector('.data-list__item')
    const confirmation: HTMLButtonElement = fixture.nativeElement.querySelector('.data-list__footer button')
    expect(confirmation.disabled).toBeTrue()

    item.click()
    fixture.detectChanges()
    expect(confirmation.disabled).toBeFalse()
    confirmation.click()

    expect(confirm).toHaveBeenCalledOnceWith([{id: 1}])
  })
});
