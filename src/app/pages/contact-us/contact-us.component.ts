// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { getTranslation } from 'src/helpers/utils';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {
  contactForm: FormGroup;
  emailField = new FormControl('', [Validators.required, Validators.email]);
  nameField = new FormControl('', Validators.required);
  fileField = new FormControl('');
  messageField = new FormControl('', Validators.required);

  isUploadLoading: boolean = false;
  isUploadSuccess: boolean = false;
  isFeedbackLoading: boolean = false;

  @ViewChild('fileInput') myInputVariable: ElementRef;

  constructor(
    private feedbackServ: FeedbackService,
    private router: Router,
    private translate: TranslateService,
    private snackbar: MatSnackBar
  ) {
    this.contactForm = new FormGroup({
      email: this.emailField,
      name: this.nameField,
      file: this.fileField,
      message: this.messageField,
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isFeedbackLoading = true;

      this.feedbackServ
        .submit({
          email: this.emailField.value,
          name: this.nameField.value,
          message: this.messageField.value,
          attachments: this.fileField.value,
        })
        .toPromise()
        .then(async () => {
          let message = getTranslation('thank you for your feedback!', this.translate);
          this.snackbar.open(message, null, { duration: 3000 });

          this.router.navigateByUrl('/dashboard');
        })
        .catch(async err => {
          console.error(err);
          let message = getTranslation('an error occurred while processing your request', this.translate);
          this.snackbar.open(message, null, { duration: 3000 });
        });
    }
  }

  openFile() {
    this.myInputVariable.nativeElement.click();
  }

  onFileChange(files: FileList) {
    if (files && files.length) {
      this.isUploadLoading = true;
      this.isUploadSuccess = false;

      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append('file[]', file, file.name);
      }

      this.feedbackServ
        .upload(formData)
        .toPromise()
        .then((images: number[]) => {
          this.fileField.patchValue(images);
          this.isUploadSuccess = true;
        })
        .catch(err => {
          console.error(err.error);
          Swal.fire({ type: 'error', title: 'Oops...', text: err.error });
        })
        .finally(() => (this.isUploadLoading = false));
    }
  }
}
