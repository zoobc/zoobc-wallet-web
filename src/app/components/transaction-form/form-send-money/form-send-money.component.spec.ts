import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSendMoneyComponent } from './form-send-money.component';

describe('FormSendMoneyComponent', () => {
  let component: FormSendMoneyComponent;
  let fixture: ComponentFixture<FormSendMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSendMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSendMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
