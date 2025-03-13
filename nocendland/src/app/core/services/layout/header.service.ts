import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public title: WritableSignal<string> = signal('NOCENDLAND')
  constructor() { }
}
