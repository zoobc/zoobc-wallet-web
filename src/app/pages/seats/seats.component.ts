import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SeatDetailComponent } from './seat-detail/seat-detail.component';
import { FormGroup, FormControl } from '@angular/forms';
import { SeatService } from 'src/app/services/seat.service';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss'],
})
export class SeatsComponent implements OnInit {
  withDetail: boolean = true;
  detailSetRefDialog: MatDialogRef<any>;

  form: FormGroup;
  searchField = new FormControl('');

  seats: any[] = null;

  isLoading = false;
  isError = false;

  constructor(public dialog: MatDialog, private seatServ: SeatService) {
    this.form = new FormGroup({
      search: this.searchField,
    });
  }

  ngOnInit() {}

  onOpenDetailSeat(tokenId: number) {
    this.detailSetRefDialog = this.dialog.open(SeatDetailComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: tokenId,
    });
  }

  onSearch() {
    const search = this.searchField.value;

    this.isLoading = true;
    this.isError = false;
    this.seatServ
      .search(search)
      .then(seats => {
        this.seats = seats;
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err);
        this.isLoading = false;
        this.isError = true;
      });
  }
}
