import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog"
import {DIALOG_CONFIRM} from "@shared/services/confirm-dialog.service"
import {MatButton} from "@angular/material/button"
import {STRING} from "@data/constants/STRING"
import {NgIf} from "@angular/common"
import {CdkMonitorFocus} from "@angular/cdk/a11y"

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    NgIf,
    CdkMonitorFocus
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) protected data: DIALOG_CONFIRM, private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
  }

  public close(acepted: boolean): void {
    this.dialogRef.close(acepted)
  }

  protected readonly STRING = STRING
}
