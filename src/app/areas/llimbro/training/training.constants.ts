export const TRAINING_WEEKDAYS = [
  {id: 1, shortLabel: 'Lun', label: 'Lunes'},
  {id: 2, shortLabel: 'Mar', label: 'Martes'},
  {id: 3, shortLabel: 'Mié', label: 'Miércoles'},
  {id: 4, shortLabel: 'Jue', label: 'Jueves'},
  {id: 5, shortLabel: 'Vie', label: 'Viernes'},
  {id: 6, shortLabel: 'Sáb', label: 'Sábado'},
  {id: 7, shortLabel: 'Dom', label: 'Domingo'},
] as const

export function getIsoWeekday(date: Date): number {
  return date.getDay() || 7
}

