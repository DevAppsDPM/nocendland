import { Injectable } from '@angular/core';
import {Observable} from "rxjs"
import {MatDialog} from "@angular/material/dialog"
import {ConfirmDialogComponent} from "@shared/components/confirm-dialog/confirm-dialog.component"
import {ThemePalette} from "@angular/material/core"

export type DIALOG_CONFIRM = {
  title: string
  message: string
  acceptButton?: DIALOG_CONFIRM_BUTTON
  cancelButton?: DIALOG_CONFIRM_BUTTON
}

type DIALOG_CONFIRM_BUTTON = {
  text?: string
  show?: boolean
  color?: ThemePalette
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private matDialog: MatDialog) { }

  public open(config: DIALOG_CONFIRM): Observable<boolean> {
    return this.matDialog.open(ConfirmDialogComponent, { data: config, autoFocus: false }).afterClosed()
  }
}
