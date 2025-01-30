import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForOf} from "@angular/common"

@Component({
    selector: 'app-calendar',
    imports: [
        NgForOf,
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, AfterViewInit {
  protected currentDate: Date = new Date();
  protected currentMonth: number = this.currentDate.getMonth();
  protected currentYear: number = this.currentDate.getFullYear();
  protected currentDay: number = this.currentDate.getDate();
  public selectedDate: Date = new Date(this.currentYear, this.currentMonth, this.currentDay)

  monthNames: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  weekDays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom']; // Comienza el lunes

  daysInMonth: number[] = [];

  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.generateCalendar()
  }

	ngAfterViewInit() {
    // this.selectedDate = new Date(this.currentYear, this.currentMonth, this.currentDay)
    this.onDayClick(this.currentDay)
  }

  generateCalendar() {
    const daysInCurrentMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  }

  // Ajusta la cantidad de días vacíos
  getEmptyDays() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    return firstDayOfMonth === 0 ? Array.from({ length: 6 }) : Array.from({ length: firstDayOfMonth - 1 });
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  protected onDayClick(day: number): void {
    this.currentDay = day
    const newDate: Date = new Date(this.currentYear, this.currentMonth, day)

    console.log('New date selected', newDate)
    
    this.selectedDate = newDate
    this.dateSelected.emit(this.selectedDate);  // Emitimos la fecha seleccionada
  }

  protected isSelectedDay(day: number): boolean {
    return this.selectedDate.getTime() === new Date(this.currentYear, this.currentMonth, day).getTime()
  }
}
