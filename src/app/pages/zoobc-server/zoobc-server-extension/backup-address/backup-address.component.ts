import { Component, OnInit } from '@angular/core';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-backup-address',
  templateUrl: './backup-address.component.html',
  styleUrls: ['./backup-address.component.scss']
})
export class BackupAddressComponent implements OnInit {

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  async onComingSoonPage() {
    let message = getTranslation('coming soon', this.translate);
    Swal.fire({
      type: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
