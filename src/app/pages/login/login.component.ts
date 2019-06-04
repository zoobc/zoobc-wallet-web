import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as sha512 from 'js-sha512';
import { Router } from '@angular/router';

import { AppService } from '../../app.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  pin = localStorage.getItem('pin')
  accounts: any = []
  isPinNeeded = this.pin ? true : false

  formLoginPin: FormGroup
  pinForm = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern("^[0-9]*$")
  ]);

  constructor(private router: Router, private appServ: AppService) {
    this.formLoginPin = new FormGroup({
      pin: this.pinForm
    })

    this.accounts = appServ.getAllAccount()
  }

  ngOnInit() {
    console.log(this.appServ.getAllAccount());
  }

  onLoginPin() {
    if (this.formLoginPin.valid) {
      if (this.pin == sha512.sha512(this.pinForm.value)) {
        this.isPinNeeded = false
      }
    }
  }

  onLoginAccount(val) {
    this.appServ.changeCurrentAccount(val)
    this.router.navigateByUrl("/dashboard");
  }

}
