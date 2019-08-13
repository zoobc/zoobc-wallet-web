import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPassphraseComponent } from './confirm-passphrase.component';

describe('ConfirmPassphraseComponent', () => {
  let component: ConfirmPassphraseComponent;
  let fixture: ComponentFixture<ConfirmPassphraseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPassphraseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPassphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
