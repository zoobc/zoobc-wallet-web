import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { wordlist} from '../../../assets/js/wordlist';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  phaseprase: any;

  constructor(private modalService: NgbModal, private router: Router) {}

  ngOnInit() {
    window.scroll(0, 0)
    this.generateNewPassphrase();
  }

  generateNewPassphrase() {

    const crypto = window.crypto;
    let pass: any;
    const phraseWords = [];

    if (crypto) {
      const bits = 128;
      const random = new Uint32Array(bits / 32);
      crypto.getRandomValues(random);
      const n = wordlist.length;
      let x: any;
      let w1: any;
      let w2: any;
      let w3: any;

      for (let i = 0; i < random.length; i++) {
        x = random[i];
        w1 = x % n;
        w2 = (((x / n) >> 0) + w1) % n;
        w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;
        phraseWords.push(wordlist[w1]);
        phraseWords.push(wordlist[w2]);
        phraseWords.push(wordlist[w3]);
      }
    }
    this.phaseprase = phraseWords;
    return this.phaseprase.sort(() => Math.random() - 0.5);
  }

  copyPassphrase() {
    const phaseprase = this.phaseprase.join(" ");
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
