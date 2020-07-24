import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SeatDetailComponent } from './seat-detail/seat-detail.component';
import { FormGroup, FormControl } from '@angular/forms';
import { SeatService, Seat } from 'src/app/services/seat.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss'],
})
export class SeatsComponent implements OnDestroy {
  withDetail: boolean = true;
  detailSetRefDialog: MatDialogRef<any>;

  form: FormGroup;
  searchField = new FormControl('');

  seats: Seat[] = null;
  page: number = 1;
  next: boolean = false;
  prev: boolean = false;

  isLoading = false;
  isError = false;

  routerEvent: Subscription;

  constructor(
    public dialog: MatDialog,
    private seatServ: SeatService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.form = new FormGroup({
      search: this.searchField,
    });

    this.routerEvent = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute.queryParams.subscribe(res => {
          this.page = parseInt(res.page) || 1;
          this.searchField.setValue(res.search || '');
        });
        this.getSeats();
      }
    });
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }

  onOpenDetailSeat(tokenId: number) {
    this.detailSetRefDialog = this.dialog.open(SeatDetailComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: tokenId,
    });
  }

  getSeats() {
    const search = this.searchField.value;

    this.isLoading = true;
    this.isError = false;
    this.seatServ
      .search(search, this.page)
      .then(res => {
        this.seats = res.seats;
        this.next = res.next;
        this.prev = res.prev;
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err);
        this.isLoading = false;
        this.isError = true;
      });
  }

  onSearch() {
    let params = {
      search: this.searchField.value,
      page: 1,
    };

    this.router.navigate(['dashboard'], { queryParams: params });
  }

  goTo(e, pageIdx) {
    e.preventDefault();
    let navigationExtras: NavigationExtras = {
      queryParams: { page: pageIdx, search: this.searchField.value },
    };
    this.router.navigate(['/dashboard'], navigationExtras);
  }
}
