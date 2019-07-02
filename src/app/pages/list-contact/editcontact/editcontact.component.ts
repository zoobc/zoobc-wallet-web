import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-editcontact',
  templateUrl: './editcontact.component.html',
  styleUrls: ['./editcontact.component.scss'],
})
export class EditcontactComponent implements OnInit {
  contact;
  id;

  @ViewChild('f') form: any;
  constructor(
    private activRoute: ActivatedRoute,
    private appServ: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.activRoute.snapshot.params['id'];
    let contact = this.appServ.getContactList();
    this.contact = contact.find(p => p.id == this.id);
    console.log('a', this.contact);
  }

  onSubmit() {
    if (this.form.value) {
      console.log('b', this.form.value);
      this.appServ.updateContact(this.contact, this.form.value);
      this.router.navigateByUrl('/Contact-list');
    }
  }
}
