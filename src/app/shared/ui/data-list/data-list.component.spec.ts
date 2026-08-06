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
});
