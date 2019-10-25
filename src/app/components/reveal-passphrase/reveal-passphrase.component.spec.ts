import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevealPassphraseComponent } from './reveal-passphrase.component';

describe('RevealPassphraseComponent', () => {
  let component: RevealPassphraseComponent;
  let fixture: ComponentFixture<RevealPassphraseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevealPassphraseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevealPassphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
