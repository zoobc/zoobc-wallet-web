import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-multisig',
  templateUrl: './create-multisig.component.html',
})
export class CreateMultisigComponent implements OnInit {
  routerEvent: Subscription;
  stepper: number = 1;

  constructor(private activeRoute: ActivatedRoute, router: Router) {
    this.routerEvent = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const step = this.activeRoute.snapshot.firstChild.url[0].path;
        this.stepper = step == 'add-multisig-info' ? 1 : step == 'create-transaction' ? 2 : 3;
      }
    });
  }

  ngOnInit() {}
}
