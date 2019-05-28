import { Component, OnInit } from "@angular/core";

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

  constructor() {}

  ngOnInit() {}
}
