import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';

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
          let message: string;
          await this.translate
            .get('Thank you for your feedback!')
            .toPromise()
            .then(res => (message = res));
          this.snackbar.open(message, null, { duration: 3000 });

          this.router.navigateByUrl('/dashboard');
        })
        .catch(async err => {
          console.error(err);
          let message: string;
          await this.translate
            .get('An error occurred while processing your request')
            .toPromise()
            .then(res => (message = res));
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
