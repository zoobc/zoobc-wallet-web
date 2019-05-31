import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  phaseprase = [
    "yeah",
    "howl",
    "space",
    "allow",
    "bruise",
    "essence",
    "feed",
    "demon",
    "content",
    "manage",
    "beautiful",
    "creature"
  ];

  constructor(private modalService: NgbModal, private router: Router) {}

  ngOnInit() {
    window.scroll(0, 0)
    this.generateNewPassphrase();
  }

  generateNewPassphrase() {
    return this.phaseprase.sort(() => Math.random() - 0.5);
  }

  copyPassphrase() {
    let phaseprase = this.phaseprase.join(" ");
    this.copyText(phaseprase);
  }

  copyText(text) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.opacity = "0";
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }

  openCreatePin(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        beforeDismiss: () => false
      })
      .result.then(() => {
        this.router.navigateByUrl("/dashboard");
      });
  }
}
