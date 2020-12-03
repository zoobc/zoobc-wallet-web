import { Component, OnInit } from '@angular/core';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zoobc-server-extension',
  templateUrl: './zoobc-server-extension.component.html',
  styleUrls: ['./zoobc-server-extension.component.scss']
})
export class ZoobcServerExtensionComponent implements OnInit {

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
