import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { getTranslation } from 'src/helpers/utils';

@Component({
  selector: 'app-sell-zbc',
  templateUrl: './sell-zbc.component.html',
  styleUrls: ['./sell-zbc.component.scss'],
})
export class SellZbcComponent implements OnInit {
  minDate = new Date();
  maxDate = new Date();
  constructor(private translate: TranslateService) {
    this.maxDate.setDate(this.maxDate.getDate() + 10);
  }

  ngOnInit() {}

  onSelect(account) {}
  async onOpenComingSoon() {
    let message = await getTranslation('Coming Soon', this.translate);
    Swal.fire({
      type: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
