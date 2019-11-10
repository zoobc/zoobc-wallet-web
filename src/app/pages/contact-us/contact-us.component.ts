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
  emailField = new FormControl('', [Validators.required, Validators.email]);
  subjectField = new FormControl('', Validators.required);
  fileField = new FormControl(null);
  messageField = new FormControl('', Validators.required);
  sendCopyCheck = new FormControl(false);
  imgURL: any;

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

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactForm.reset();
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.controls[key].setErrors(null);
      });
      this.filename = '';
      this.imgURL = null;
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

      const mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.imgURL = null;
        this.fileField.setErrors({ invalidType: true });
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.contactForm.patchValue({
            file: reader.result,
          });

          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
          this.imgURL = reader.result;
        };
      }
    }
  }
}
