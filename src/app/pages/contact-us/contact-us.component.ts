import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  contactFormD: FormGroupDirective;
  emailField = new FormControl('', [Validators.required, Validators.email]);
  subjectField = new FormControl('', Validators.required);
  fileField = new FormControl(null);
  messageField = new FormControl('', Validators.required);
  sendCopyCheck = new FormControl(false);

  filename: string;

  @ViewChild('fileInput') myInputVariable: ElementRef;

  constructor(private cd: ChangeDetectorRef) {
    this.contactForm = new FormGroup({
      email: this.emailField,
      subject: this.subjectField,
      file: this.fileField,
      message: this.messageField,
      canSendCopy: this.sendCopyCheck,
    });
  }
  ngOnInit() {}

  onSubmit(form: FormGroupDirective) {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.contactForm.reset();
      form.resetForm();
      this.filename = '';
    }
  }

  openFile() {
    this.myInputVariable.nativeElement.click();
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.filename = event.target.files[0].name;

      reader.readAsDataURL(file);

      reader.onload = () => {
        this.contactForm.patchValue({
          contactFormFile: reader.result,
        });

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }
}
