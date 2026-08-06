import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog"
import {DIALOG_CONFIRM} from "@shared/ui/services/confirm-dialog.service"
import {MatButton} from "@angular/material/button"
import {UI_TEXT} from '@shared/ui/ui-text.constants';


@Component({
    selector: 'app-confirm-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
],
    templateUrl: './confirm-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) protected data: DIALOG_CONFIRM, private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
  }

  public close(accepted: boolean): void {
    this.dialogRef.close(accepted)
  }

  protected readonly text = UI_TEXT
}
