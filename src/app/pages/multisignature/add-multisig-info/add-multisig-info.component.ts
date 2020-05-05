import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-add-multisig-info',
  templateUrl: './add-multisig-info.component.html',
  styleUrls: ['./add-multisig-info.component.scss'],
})
export class AddMultisigInfoComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  isCompleted = true;
  minParticipants = 3;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  participantForm = new FormControl('', Validators.required);
  nonceForm = new FormControl('', Validators.required);
  minSignatureForm = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder) {
    this.firstFormGroup = new FormGroup({
      participants: this.fb.array([]),
      nonce: this.nonceForm,
      minSignature: this.minSignatureForm,
    });
  }

  ngOnInit() {
    this.stepper.selectedIndex = 0;
    this.setDefaultParticipantsForms();
  }

  onAddParticipants() {
    (<FormArray>this.firstFormGroup.get('participants')).push(this.participantForm);
  }

  setDefaultParticipantsForms() {
    for (let i = 1; i <= this.minParticipants; i++) {
      this.onAddParticipants();
    }
  }
}
