import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinConfirmationComponent } from './pin-confirmation.component';

describe('PinConfirmationComponent', () => {
  let component: PinConfirmationComponent;
  let fixture: ComponentFixture<PinConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
