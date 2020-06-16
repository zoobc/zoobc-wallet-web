import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SeatDetailComponent } from './seat-detail/seat-detail.component';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss'],
})
export class SeatsComponent implements OnInit {
  withDetail: boolean = true;
  detailSetRefDialog: MatDialogRef<any>;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  onOpenDetailSeat() {
    this.detailSetRefDialog = this.dialog.open(SeatDetailComponent, {
      width: '420px',
      maxHeight: '90vh',
    });
  }
}
